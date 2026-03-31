import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'Senior Check-In <onboarding@resend.dev>',
      to: ['YOUR_EMAIL@GMAIL.COM'], // *** שמי כאן את המייל שלך ***
      subject: 'בוקר טוב! הכל בסדר ❤️',
      html: '<p>אמא לחצה על הכפתור והכל תקין!</p>',
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}