export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto p-12 text-right dir-rtl font-sans leading-relaxed text-slate-800" dir="rtl">
      <h1 className="text-4xl font-black mb-10 text-slate-900">תנאי שימוש ומדיניות פרטיות</h1>
      
      {/* הגישה החיובית והמאירה */}
      <section className="mb-12 bg-green-50 p-8 rounded-3xl border border-green-100">
        <h2 className="text-2xl font-bold mb-4 text-green-900 italic">החזון שלנו: תקשורת משפחתית קרובה</h2>
        <p className="text-lg">
          SeniorSafe נולדה מתוך רצון להוסיף אור ורוגע ליומיום של המשפחה. השירות נועד להוות גשר דיגיטלי חם, המאפשר להורים לעדכן בנגיעה אחת שהם התחילו את היום בכיף, ולבנים ובנות לקבל את העדכון הזה תוך כדי שגרת העבודה והחיים העמוסה. 
          <strong> אנחנו כאן כדי להחליף את הלחץ בחיוך.</strong>
        </p>
      </section>

      {/* הבהרה משפטית (השכפ"ץ שלך) */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 italic">1. מהות השירות והגבלת אחריות</h2>
        <p className="text-lg mb-4">
          השירות הינו כלי עזר לניהול תקשורת משפחתית בלבד. המערכת מסתמכת על תשתיות צד שלישי (כגון רשתות סלולריות, אינטרנט, שירותי WhatsApp ושרתים).
        </p>
        <ul className="list-disc pr-6 space-y-2 text-slate-700 bg-slate-50 p-6 rounded-xl">
          <li><strong>אי-זמינות טכנית:</strong> החברה אינה אחראית לעיכובים או אי-שליחת הודעות הנובעים מתקלות תקשורת, חוסר קליטה במכשיר הקצה, או תקלות מכניות שאינן בשליטתה.</li>
          <li><strong>לא שירות חירום:</strong> השירות אינו מהווה תחליף ללחצן מצוקה, למענה רפואי או להשגחה פיזית. בכל מקרה של חשש דחוף, יש לפעול בדרכי התקשורת המקובלות (טלפון/ביקור).</li>
          <li><strong>הסתמכות:</strong> השימוש בשירות הוא באחריות המשתמש. אנו עושים הכל כדי שהמערכת תהיה יציבה, אך אין להסתמך עליה כעל מקור מידע בלעדי במצבי סיכון.</li>
        </ul>
      </section>

      <section className="mb-10 border-t pt-8 italic">
        <h2 className="text-xl font-bold mb-4">2. פרטיות</h2>
        <p>
          מספרי הטלפון שלכם נשמרים אצלנו כפיקדון של אמון. הם משמשים אך ורק למשלוח הודעות הווטסאפ המשפחתיות שלכם. 
        </p>
      </section>

      <footer className="mt-20 pt-8 border-t text-sm text-slate-400 text-center uppercase">
        לכל שאלה: <span dir="ltr">054-6060011</span> | SeniorSafe 2026
      </footer>
    </div>
  );
}