'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl text-right">
      <nav className="p-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/landing" className="text-blue-600 font-bold">← חזרה לדף הבית</Link>
          <div className="text-xl font-black text-slate-800 tracking-tighter">SeniorSafe</div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-8 md:p-16 text-right leading-relaxed text-slate-800">
        <span className="text-blue-600 font-black text-sm uppercase tracking-widest">הסיפור שלנו</span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-8 text-slate-900">כשהמקצוע והלב נפגשים.</h1>
        
        <div className="prose prose-blue prose-lg">
          <p className="text-xl font-bold text-slate-700 mb-6">
            נעים מאוד, אני מרפאה בעיסוק שחיה ונושמת את עולם הגיל השלישי מדי יום.
          </p>
          
          <p className="mb-6">
            במשך שנים אני רואה את המורכבות הזו מהצד המקצועי: את הרצון של ההורים לשמור על עצמאות ופרטיות, מול הצורך הבלתי פוסק של הילדים לדעת ש"הכל בסדר". 
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-12 mb-4 italic">זה הכה בי בבית שלי</h2>
          <p className="mb-6">
            בתור בת להורים מבוגרים, מצאתי את עצמי באותה מלכודת. בכל בוקר מחדש הלב שלי היה מחסיר פעימה: 
            <span className="font-bold"> "האם להתקשר עכשיו? אולי הם עוד ישנים? אולי קרה משהו והם לא יכולים לענות?"</span>
          </p>
          
          <p className="mb-8">
            השיחות הללו הפכו לפעמים ל"בדיקת נוכחות" טכנית ומלחיצה. ההורים הרגישו שמנטרים אותם, ואנחנו הילדים הרגשנו חרדה תמידית. הבנתי שחסר לנו משהו קטן, פשוט ומכבד שיסגור את הפער הזה.
          </p>

          <div className="bg-white p-8 rounded-4xl border-2 border-blue-100 shadow-xl mb-12 transform -rotate-1">
            <h3 className="text-blue-600 font-black mb-4 underline">הפיתרון שנולד מהמצוקה</h3>
            <p className="italic text-lg text-slate-700">
              "בניתי את SeniorSafe כדי להחליף את הלחץ והחרדה בחיוך קטן של בוקר. האפליקציה הזו היא לא מכשיר מעקב – היא גשר של אהבה. היא מאפשרת להורה לומר 'אני כאן, הכל טוב' בלחיצה אחת, ולנו להמשיך את יום העבודה בלב שקט."
            </p>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">הערכים שלנו:</h2>
          <ul className="list-none space-y-4 mb-12 p-0">
            <li className="flex items-center gap-3">
              <span className="text-blue-500 text-xl font-bold">✓</span>
              <span className="font-bold text-slate-700 leading-tight">עצמאות לפני הכל:</span> הריבונות של ההורה על היום שלו היא קדושה.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500 text-xl font-bold">✓</span>
              <span className="font-bold text-slate-700 leading-tight">פשטות קיצונית:</span> כפתור אחד, בלי תפריטים ובלי סיבוכים.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500 text-xl font-bold">✓</span>
              <span className="font-bold text-slate-700 leading-tight">שקט נפשי:</span> כי לילדים מגיע לעבוד ולחיות בלי חרדה תמידית.
            </li>
          </ul>

          <div className="text-center bg-blue-600 p-8 rounded-3xl text-white">
            <h3 className="text-2xl font-black mb-4">מוכנים להחזיר את הרוגע למשפחה?</h3>
            <Link href="/landing#offer" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-transform">
              אני רוצה להצטרף לנבחרת המייסדים
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-12 text-center text-slate-400 text-xs">
        © 2026 SeniorSafe | נבנה עם המון אהבה להורים שלנו
      </footer>
    </div>
  );
}