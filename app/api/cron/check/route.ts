import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    // 1. נביא את כל הלקוחות הפעילים (אלו ששילמו)
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('email, id')
      .eq('payment_status', 'paid');

    if (custError) throw custError;

    for (const customer of customers) {
      // 2. לכל לקוח - נבדוק אם יש צ'ק-אין מהיום שמשויך למייל שלו
      const { data: checkins, error: checkError } = await supabase
        .from('checkins')
        .select('*')
        .eq('email', customer.email) // סינון לפי מייל הלקוח
        .gte('created_at', todayIso);

      if (checkError) continue;

      // 3. אם לא נמצא צ'ק-אין להורה של הלקוח הזה
      if (!checkins || checkins.length === 0) {
        // נביא את אנשי הקשר שמשויכים ללקוח הזה בלבד
        const { data: contacts, error: contError } = await supabase
          .from('contacts')
          .select('phone')
          .eq('customer_email', customer.email); // ודאי שיש לך עמודה כזו בטבלה

        if (contError || !contacts) continue;

        // 4. שליחת התראה לכל איש קשר של הלקוח הספציפי
        const instanceId = process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID;
        const token = process.env.NEXT_PUBLIC_ULTRAMSG_TOKEN;

        for (const contact of contacts) {
          await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: token!,
              to: contact.phone,
              body: `⚠️ התראת SeniorSafe: לא התקבל עדכון בוקר מההורה. מומלץ לבדוק מה שלומו. ❤️`
            })
          });
        }
      }
    }

    return NextResponse.json({ message: 'Cron job completed successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}