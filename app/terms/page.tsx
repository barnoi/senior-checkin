'use client';
import Link from 'next/link';
import { Scale, ArrowRight, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-right p-8 md:p-20" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <Scale size={48} className="text-slate-900 mb-4" />
          <h1 className="text-4xl font-black text-slate-900 mb-2">תנאי שימוש</h1>
          <p className="text-slate-500 font-medium text-lg italic">SeniorSafe - הסכם שימוש</p>
          <p className="text-slate-400 text-sm mt-4">עודכן לאחרונה: אפריל 2026</p>
        </header>

        <section className="space-y-8 text-slate-700 leading-relaxed">
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-4xl flex items-start gap-4">
            <AlertTriangle className="text-red-600 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-red-900 font-black text-lg mb-1 italic underline">הבהרה משפטית קריטית</h2>
              <p className="text-red-800 text-sm leading-relaxed font-bold">
                SeniorSafe אינה מערכת הצלת חיים ואינה תחליף למוקדי חירום (מד"א, משטרה). השירות נועד לסיוע בתקשורת משפחתית בלבד. החברה אינה אחראית לכל נזק, פגיעה או אובדן כתוצאה מהסתמכות על השירות למקרי חירום רפואיים.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. הסכמה לתנאים</h2>
            <p>השימוש באפליקציה מהווה הסכמה מלאה ובלתי חוזרת לתנאים המפורטים בדף זה. במידה ואינך מסכים/ה לאחד התנאים, עליך להפסיק את השימוש בשירות באופן מיידי.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. הגבלת אחריות טכנית</h2>
            <p>אספקת השירות תלויה בתקינות רשת האינטרנט, המכשיר הסלולרי של המשתמש וספקי שירות צד ג'. החברה אינה מתחייבת שהשירות יפעל ללא תקלות, השהיות או הפרעות ולא תישא באחריות למקרה בו הודעת עדכון לא הגיעה ליעדה מכל סיבה שהיא.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. שימוש הוגן ואחריות המשתמש</h2>
            <p>המשתמש אחראי באופן בלעדי על דיוק הנתונים שהזין (מספרי טלפון ושמות). אין להשתמש בשירות למטרות הטרדה, שליחת הודעות ספאם או כל פעולה המנוגדת לחוקי מדינת ישראל.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. שינויים בשירות ובעלויות</h2>
            <p>החברה שומרת לעצמה את הזכות לעדכן את תכונות האפליקציה, להוסיף מסלולי תשלום או לשנות את תנאי השירות מעת לעת. הודעה על שינויים מהותיים תימסר למשתמשים דרך הממשק או במייל.</p>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="font-bold mb-2">ליצירת קשר ותמיכה טכנית:</p>
            <a href="mailto:hello@communicateclever.com" className="text-blue-600 font-bold underline">hello@communicateclever.com</a>
          </div>
        </section>

        <footer className="mt-16">
          <Link href="/checkin" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all">
            חזרה לאפליקציה <ArrowRight size={16} />
          </Link>
        </footer>
      </div>
    </div>
  );
}