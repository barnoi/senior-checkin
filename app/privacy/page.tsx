export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-12 text-right dir-rtl font-sans leading-relaxed text-slate-800" dir="rtl">
      <h1 className="text-4xl font-black mb-10 text-slate-900 underline decoration-blue-500">מדיניות פרטיות</h1>
      <p className="text-lg mb-6 font-bold text-blue-600 italic">המידע שלכם הוא פיקדון של אמון אצלנו.</p>
      <ul className="list-disc pr-6 space-y-4 text-lg">
        <li><strong>מינימום מידע:</strong> אנו שומרים רק את מספרי הטלפון הדרושים למשלוח הודעות הווטסאפ.</li>
        <li><strong>אפס שיתוף:</strong> לעולם לא נמכור, נשתף או נעביר את המידע שלכם ושל ההורים שלכם לגורמים חיצוניים.</li>
        <li><strong>אבטחה:</strong> כל הנתונים נשמרים במסד נתונים מאובטח המוגן בטכנולוגיות המתקדמות ביותר.</li>
      </ul>
      <p className="mt-10 pt-6 border-t font-bold">לכל שאלה בנושא פרטיות: 054-6060011</p>
    </div>
  );
}