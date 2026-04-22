'use client';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* כפתור חזרה לדף הבית */}
        <Link href="/" className="inline-block mb-6 text-sm font-bold text-blue-600 hover:underline">
          ← חזרה לדף הבית
        </Link>

        <div className="bg-white shadow-xl rounded-[2.5rem] p-10 border border-slate-100 text-right font-sans">
          <h1 className="text-4xl font-black mb-8 text-blue-600 italic">אנחנו כאן בשבילכם</h1>
          
          <div className="space-y-8">
            {/* ערוץ ווטסאפ וטלפון */}
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-2xl font-bold mb-2 text-green-800">ווטסאפ ושירות טלפוני</h2>
              <p className="text-3xl font-black text-slate-800 tracking-tighter mb-1" dir="ltr">054-6060011</p>
              <p className="text-sm text-green-700 font-medium">זמינים בימים א'-ה' בין 09:00 ל-18:00</p>
            </div>

            {/* ערוץ אימייל */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold mb-2 text-slate-700">תמיכה במייל</h2>
              <a 
                href="mailto:hello@communicateclever.com" 
                className="text-xl font-bold text-blue-600 hover:underline break-all"
              >
                hello@communicateclever.com
              </a>
              <p className="text-sm text-slate-500 mt-2">מענה אנושי תוך 24 שעות</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
              SeniorSafe • Family Security Systems
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}