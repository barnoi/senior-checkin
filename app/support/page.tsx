export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto p-12 text-right dir-rtl font-sans bg-white shadow-xl my-10 rounded-3xl border border-slate-100" dir="rtl">
      <h1 className="text-4xl font-black mb-8 text-blue-600 italic">אנחנו כאן בשבילכם</h1>
      <div className="space-y-8">
        <div className="bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm transition-hover hover:shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-green-800">ווטסאפ ושירות טלפוני</h2>
          <p className="text-3xl font-black text-slate-800 tracking-tighter mb-2" dir="ltr">054-6060011</p>
          <p className="text-sm text-green-700 font-medium">זמינים בימים א'-ה' בין 09:00 ל-18:00</p>
        </div>
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold mb-2 text-slate-700">תמיכה במייל</h2>
          <p className="text-xl font-bold">support@seniorsafe.co.il</p>
        </div>
      </div>
    </div>
  );
}