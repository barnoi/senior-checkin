import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // בדיקה שהקריאה מגיעה מ-Vercel (אבטחה)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // בודק אם יש לחיצה מהיום
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .gte('created_at', today);

    if (error) throw error;

    // אם אין נתונים (כלומר - לא לחצו היום)
    if (!data || data.length === 0) {
      await resend.emails.send({
        from: 'Senior Check-In <onboarding@resend.dev>',
        to: ['YOUR_EMAIL@GMAIL.COM'], // המייל של המשפחה
        subject: '⚠️ התראה: לא התקבל עדכון בוקר',
        html: `
          <div style="direction: rtl; font-family: sans-serif;">
            <h2>שימו לב,</h2>
            <p>השעה 11:00 בבוקר ולא התקבל אישור "אני בסדר" מההורה.</p>
            <p>מומלץ ליצור קשר טלפוני או לבדוק מה שלומם.</p>
          </div>
        `,
      });
      return NextResponse.json({ message: 'Alert email sent' });
    }

    return NextResponse.json({ message: 'Everything is okay' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}