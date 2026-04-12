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
        <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px;">
          <h1 style="color: #3b82f6;">ברוכים הבאים ל-SeniorSafe!</h1>
          <p>שמחים שהצטרפת אלינו. עכשיו השקט הנפשי שלך ושל אמא נמצא בידיים טובות.</p>
          <p><strong>מה עושים עכשיו?</strong></p>
          <ul>
            <li>מוסיפים את המלווים בדף הניהול.</li>
            <li>שומרים את האתר כקיצור דרך על מסך הבית של אמא.</li>
            <li>מוודאים שאמא לוחצת על הכפתור הירוק פעם ביום!</li>
          </ul>
          <p>אנחנו כאן לכל שאלה,</p>
          <p>צוות SeniorSafe</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}