import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'SeniorSafe <hello@communicateclever.com>',
      to: [email],
      subject: 'ברוכים הבאים ל-SeniorSafe! ✨',
      html: `
        <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px; color: #1e293b;">
          <h1 style="color: #2563eb;">ברוכים הבאים למשפחת SeniorSafe!</h1>
          <p style="font-size: 16px;">שמחים שהצטרפת אלינו. עכשיו השקט הנפשי שלכם נמצא בידיים טובות.</p>
          
          <div style="background-color: #f0f7ff; border: 2px solid #2563eb; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 15px;">הקישור האישי שלך לכניסה מהירה:</p>
            <a href="https://senior.communicateclever.com/admin?email=${email}" 
               style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
               לחצי כאן לכניסה לאפליקציה
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 10px;">(הקישור הזה יחבר אותך אוטומטית ללא צורך בהקלדת המייל מחדש)</p>
          </div>

          <div style="background-color: #f8fafc; border-right: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <p style="font-weight: bold; margin-bottom: 10px;">איך שומרים אותנו כאייקון על המסך? 📱</p>
            <ul style="line-height: 1.6; list-style-type: none; padding-right: 0;">
              <li>📍 <strong>באייפון (Safari):</strong> לוחצים על כפתור ה"שיתוף" (ריבוע עם חץ למעלה) ואז על <strong>"הוספה למסך הבית"</strong>.</li>
              <li style="margin-top: 10px;">📍 <strong>באנדרואיד (Chrome):</strong> לוחצים על 3 הנקודות למעלה ואז על <strong>"התקנת אפליקציה"</strong> או "הוספה למסך הבית".</li>
            </ul>
          </div>
          
          <p>הצטרפתם לנבחרת המייסדים שלנו, ואנחנו כאן כדי לוודא שאתם וההורים תמיד מחוברים.</p>
          <p>אנחנו כאן לכל שאלה,</p>
          <p style="font-weight: bold;">צוות SeniorSafe</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}