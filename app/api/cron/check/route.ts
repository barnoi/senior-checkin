import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET(request: Request) {
  const isCron = request.headers.get('x-vercel-cron') === '1';
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isCron && !isDev) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0') + ":00";
    const todayIso = new Date().toISOString().split('T')[0];

    const { data: contacts, error: contError } = await supabase
      .from('contacts')
      .select('*, customers(payment_status)')
      .eq('alert_time', currentHour);

    if (contError) throw contError;

    const instanceId = process.env.ULTRAMSG_INSTANCE_ID!;
    const token = process.env.ULTRAMSG_TOKEN!;

    for (const contact of contacts || []) {
      if (contact.customers?.payment_status !== 'paid') continue;

      // תיקון קריטי: הפיכת המייל לאותיות קטנות לפני החיפוש ב-Checkins
      const cleanEmail = contact.customer_email.toLowerCase().trim();

      const { data: checkins } = await supabase
        .from('checkins')
        .select('id')
        .eq('email', cleanEmail) // מחפש לפי המייל הנקי
        .gte('created_at', todayIso);

      if (!checkins || checkins.length === 0) {
        // שליחת ההודעה
        await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: token,
            to: contact.phone,
            body: `⚠️ התראת SeniorSafe: לא התקבל עדכון בוקר מ${contact.name || 'ההורה'}. מומלץ לבדוק מה שלומו. ❤️`
          })
        });

        console.log(`הודעה נשלחה ל-${contact.name}, ממתין 5 שניות למניעת עומס...`);
        await delay(5000); 
      }
    }

    return NextResponse.json({ success: true, processed: contacts?.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}