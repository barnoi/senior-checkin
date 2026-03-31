'use client';
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-2xl font-black text-blue-600">SeniorSafe</div>
        <div className="hidden md:flex gap-8 text-slate-600 font-medium">
          <Link href="/about" className="hover:text-blue-600 transition">אודות</Link>
          <Link href="/support" className="hover:text-blue-600 transition">תמיכה</Link>
          <Link href="/" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">כניסה למערכת</Link>
        </div>
      </nav>

      {/* Hero Section - ה-Hook */}
      <header className="bg-linear-to-b from-blue-50 to-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-6 inline-block">חדש: עדכונים ישירות לווטסאפ! 💬</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            השקט הנפשי שלכם <br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">מתחיל בלחיצה אחת.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            במקום להתקשר בלחץ כל בוקר, קבלו הודעת ווטסאפ מרגיעה כשאמא או אבא מעדכנים שהכל בסדר. פשוט, מכבד, ומרגיע.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-6 px-14 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
              הצטרפו עכשיו ללא עלות
            </button>
          </div>
        </div>
      </header>

      {/* Pain Points - ה"כאב" */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
              מכירים את התחושה שמישהו לא עונה לטלפון?
            </h2>
            <div className="space-y-6">
              {[
                "התקשרתם פעמיים בבוקר ואין מענה? החרדה מתחילה לטפס.",
                "מרגישים שאתם 'חופרים' להם עם שיחות ביקורת יומיות?",
                "רוצים לוודא שהם בסדר בלי להפריע להם באמצע היום?",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-xl text-slate-700 bg-white p-4 rounded-xl shadow-sm border-r-4 border-red-400">
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl rotate-2">
              <p className="text-2xl italic mb-6 leading-relaxed">
                "מאז שהתחלנו להשתמש בזה, הפסקתי לדאוג. אני רואה את הווטסאפ ב-8:30 בבוקר ויודעת שאמא כבר במטבח עם הקפה. זה נותן לי שקט לכל היום."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
                <div>
                  <div className="font-bold">מיכל כהן</div>
                  <div className="text-blue-200 text-sm">בת דואגת, תל אביב</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution - הווטסאפ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-20">איך זה עובד? פשוט כמו הודעה.</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">🏠</div>
              <h3 className="text-2xl font-bold mb-3 italic">1. לחיצה בבוקר</h3>
              <p className="text-slate-500">ההורה לוחץ על כפתור גדול וירוק בטלפון שלו. זה הכל.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">💬</div>
              <h3 className="text-2xl font-bold mb-3 italic">2. ווטסאפ למשפחה</h3>
              <p className="text-slate-500">כל המשפחה מקבלת מיד הודעת ווטסאפ: "אמא/אבא עדכנו שהכל בסדר! ❤️"</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">🚨</div>
              <h3 className="text-2xl font-bold mb-3 italic">3. התראה אוטומטית</h3>
              <p className="text-slate-500">לא התקבל אישור עד שעה שקבעתם? אתם מקבלים התראה דחופה מיד.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-20 px-6 text-white text-center">
        <h2 className="text-4xl font-black mb-8 italic">מוכנים להחזיר לעצמכם את השקט?</h2>
        <button className="bg-white text-blue-600 text-2xl font-black py-6 px-16 rounded-full hover:bg-slate-100 transition shadow-2xl uppercase tracking-tighter">
          התחילו עכשיו בחינם
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 text-center text-sm border-t border-slate-800">
        <div className="flex justify-center gap-8 mb-8 font-bold">
          <Link href="/about" className="hover:text-white">אודות</Link>
          <Link href="/terms" className="hover:text-white">תנאי שימוש</Link>
          <Link href="/privacy" className="hover:text-white">פרטיות</Link>
          <Link href="/support" className="hover:text-white">תמיכה</Link>
        </div>
        <p className="tracking-widest opacity-50 uppercase">SeniorSafe © 2026. PROTECTING WHAT MATTERS.</p>
      </footer>
    </div>
  );
}