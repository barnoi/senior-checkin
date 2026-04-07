import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  console.log("--- תחילת בדיקת בטיחות אוטומטית (Cron Job) ---");

  // 1. אימות אבטחה - מוודא שהקריאה מגיעה מוורסל או עם סיסמה נכונה
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("ניסיון גישה לא מורשה ל-Cron");
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 2. הגדרת טווח הזמן של "היום" (מחצות הלילה ועד עכשיו)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    console.log(`בודק האם בוצע צ'ק-אין מאז: ${todayIso}`);

    // 3. שאילתה ל-Supabase: חפש צ'ק-אין שנוצר היום
    const { data: checkins, error: checkError } = await supabase
      .from('checkins')
      .select('*')
      .gte('created_at', todayIso);

    if (checkError) throw checkError;

    // 4. אם נמצא צ'ק-אין - הכל בסדר, לא עושים כלום
    if (checkins && checkins.length > 0) {
      console.log(`נמצאו ${checkins.length} עדכונים מהיום. אין צורך לשלוח התראה.`);
      return NextResponse.json({ message: 'All good, parent checked in today.' });
    }

    // 5. אם לא נמצא צ'ק-אין - שולחים התראת חירום לילדים
    console.warn("לא נמצא עדכון מהיום! מתחיל שליחת התראות...");

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('phone');

    if (contactsError) throw contactsError;

    if (contacts && contacts.length > 0) {
      const instanceId = process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID;
      const token = process.env.NEXT_PUBLIC_ULTRAMSG_TOKEN;

      for (const contact of contacts) {
        await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: token!,
            to: contact.phone,
            body: "⚠️ התראת SeniorSafe: אמא טרם שלחה עדכון הבוקר. מומלץ להתקשר ולבדוק שהכל בסדר. ❤️"
          })
        });
        console.log(`התראה נשלחה לטלפון: ${contact.phone}`);
      }
    }

    return NextResponse.json({ message: 'No check-in found, alerts sent to family.' });

  } catch (err: any) {
    console.error('שגיאה בתהליך ה-Cron:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}