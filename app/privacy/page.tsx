'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-right p-8 md:p-20" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <ShieldCheck size={48} className="text-blue-600 mb-4" />
          <h1 className="text-4xl font-black text-slate-900 mb-2">מדיניות פרטיות</h1>
          <p className="text-slate-500 font-medium text-lg italic">SeniorSafe - Family Circle</p>
          <p className="text-slate-400 text-sm mt-4">עודכן לאחרונה: אפריל 2026</p>
        </header>

        <section className="space-y-8 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. המידע שאנו אוספים</h2>
            <p>לצורך תפעול האפליקציה, אנו אוספים מידע בסיסי הכולל: שמות משתמשים, מספרי טלפון, ותמונות פרופיל שהועלו על ידי המנהל. בנוסף, המערכת שומרת נתונים אודות זמני ה-Check-in שבוצעו.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. השימוש במידע</h2>
            <p>המידע משמש אך ורק למטרת שליחת עדכונים למלווים שהוגדרו מראש. אנו מתחייבים כי המידע האישי שלכם **לא יימכר, לא יושכר ולא יועבר** לצדדים שלישיים למטרות שיווק או פרסום.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. אבטחת מידע</h2>
            <p>אנו משתמשים בשירותי ענן מאובטחים (Supabase) העומדים בתקני האבטחה המחמירים ביותר להגנה על הנתונים שלכם. המידע מוצפן ונגיש רק למשתמשים מורשים דרך המערכת.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. הסכמת צדדים שלישיים</h2>
            <p className="bg-blue-50 p-4 rounded-xl border border-blue-100">באחריות מנהל החשבון לוודא כי כל המלווים שפרטיהם הוזנו למערכת נתנו את הסכמתם המפורשת להופעתם באפליקציה ולקבלת הודעות עדכון למכשירם האישי.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. זכויות המשתמש</h2>
            <p>המשתמש זכאי לעיין במידע שנשמר עליו, לעדכנו או לבקש את מחיקתו המוחלטת מהשרתים בכל עת. למימוש זכויות אלו ניתן לפנות אלינו במייל התמיכה.</p>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="font-bold mb-2">לשאלות נוספות בנושא פרטיות:</p>
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