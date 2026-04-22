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
          
          <div style="background-color: #f8fafc; border-right: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <p style="font-weight: bold; margin-bottom: 10px;">מה עושים עכשיו?</p>
            <ul style="line-height: 1.6;">
              <li>מוסיפים את המלווים בדף הניהול האישי.</li>
              <li>שומרים את האתר כקיצור דרך על מסך הבית של ההורה (הסבר ב-FAQ באתר).</li>
              <li>מוודאים שההורה לוחץ על הכפתור הירוק פעם ביום!</li>
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