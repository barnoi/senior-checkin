import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// פונקציית עזר להשהיה (Delay)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(req: Request) {
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
      // ניקוי מספר הטלפון מרווחים או מקפים לפני השליחה
      const cleanPhone = targetPhone.replace(/\D/g, '');
      
      const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: token,
          to: cleanPhone,
          body: `הודעה מ-SeniorSafe: ${message || "תדברו איתי"}` 
        })
      });

      const resData = await response.json();
      if (!response.ok) console.error('UltraMsg Private Error:', resData);

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
        customer_email: email,
        created_at: new Date().toISOString() 
      }]);

    if (checkinError) console.error('שגיאה ברישום checkin:', checkinError.message);

    // 2. משיכת אנשי הקשר - שימי לב: מושכים רק phone ו-name! 
    // זה קריטי כי image_url עכשיו מכיל טקסט Base64 כבד מאוד.
    const { data: contacts, error: dbError } = await supabase
      .from('contacts')
      .select('phone, name')
      .eq('customer_email', email);

    if (dbError) throw dbError;

    // 3. שליחת הודעות מדורגת (עם השהיה) למלווים
    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        if (!contact.phone) continue;

        const cleanContactPhone = contact.phone.replace(/\D/g, '');

        await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: token,
            to: cleanContactPhone,
            body: "הודעה מ-SeniorSafe: אמא עדכנה שהכל בסדר איתה! ✨"
          })
        });

        // המתנה של 3 שניות כדי למנוע חסימה ב-WhatsApp/UltraMsg
        console.log(`הודעת עדכון נשלחה ל-${contact.name || cleanContactPhone}, ממתין...`);
        await delay(3000); 
      }
    }

    return NextResponse.json({ 
      success: true, 
      mode: 'broadcast', 
      count: contacts?.length || 0 
    });

  } catch (err: any) {
    console.error('שגיאה כללית ב-API:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}