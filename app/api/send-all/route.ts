import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // קריאת הפרמטרים ששלחנו מה-Frontend
  const { type, targetPhone, message } = await req.json();

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
      console.log(`--- שליחת הודעה אישית ל: ${targetPhone} ---`);
      
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
    console.log("--- תחילת תהליך שליחה כללית ורישום לחיצה ---");
    
    // 1. רישום הלחיצה בטבלת checkins (רק בלחיצה הכללית!)
    const { error: checkinError } = await supabase
      .from('checkins')
      .insert([{ 
        status: 'ok',
        created_at: new Date().toISOString() 
      }]);

    if (checkinError) console.error('שגיאה ברישום:', checkinError.message);

    // 2. משיכת כל אנשי הקשר
    const { data: contacts, error: dbError } = await supabase
      .from('contacts')
      .select('phone');

    if (dbError) throw dbError;

    // 3. שליחת הודעות לכולם
    if (contacts && contacts.length > 0) {
      // נשתמש ב-Promise.all כדי לשלוח לכולם במקביל (מהיר יותר מ-for loop)
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

    return NextResponse.json({ success: true, mode: 'broadcast' });

  } catch (err: any) {
    console.error('שגיאה כללית:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}