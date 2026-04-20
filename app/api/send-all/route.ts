import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // הוספנו את email לרשימת הפרמטרים שמגיעים מה-Frontend
  const { type, targetPhone, message, email } = await req.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const instanceId = process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID;
  const token = process.env.NEXT_PUBLIC_ULTRAMSG_TOKEN;

  if (!supabaseUrl || !supabaseKey || !instanceId || !token) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // --- תרחיש 1: שליחה אישית (לחיצה על תמונה) ---
    if (type === 'private' && targetPhone) {
      const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: token,
          to: targetPhone,
          body: `הודעה מ-SeniorSafe: ${message || "תדברו איתי"}` 
        })
      });

      return NextResponse.json({ success: true, mode: 'private' });
    }

    // --- תרחיש 2: שליחה כללית (לחיצה על "אני בסדר") ---
    if (!email) {
      return NextResponse.json({ error: 'Email is required for broadcast' }, { status: 400 });
    }

    // 1. רישום הלחיצה בטבלת checkins
    const { error: checkinError } = await supabase
      .from('checkins')
      .insert([{ 
        status: 'ok',
        customer_email: email, // הוספת המייל לרישום ה-checkin
        created_at: new Date().toISOString() 
      }]);

    if (checkinError) console.error('שגיאה ברישום:', checkinError.message);

    // 2. משיכת אנשי הקשר המסוננים לפי המייל של המשתמש בלבד
    const { data: contacts, error: dbError } = await supabase
      .from('contacts')
      .select('phone')
      .eq('customer_email', email); // הסינון הקריטי שמונע שליחה למשתמשים אחרים

    if (dbError) throw dbError;

    // 3. שליחת הודעות רק לאנשי הקשר של אותו משתמש
    if (contacts && contacts.length > 0) {
      await Promise.all(contacts.map(contact => 
        fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: token,
            to: contact.phone,
            body: "הודעה מ-SeniorSafe: אמא עדכנה שהכל בסדר איתה! ✨"
          })
        })
      ));
    }

    return NextResponse.json({ success: true, mode: 'broadcast', count: contacts?.length || 0 });

  } catch (err: any) {
    console.error('שגיאה כללית:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}