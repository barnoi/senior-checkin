'use client';
import { useState } from 'react';

export default function SeniorPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = () => {
    setLoading(true);
    // כרגע זה רק מדמה לחיצה, בהמשך נחבר ל-Supabase
    setTimeout(() => {
      setCheckedIn(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] p-6 text-center">
      <header className="mb-16">
        <h1 className="text-5xl font-black text-slate-800 mb-3">בוקר טוב אמא ❤️</h1>
        <p className="text-xl text-slate-500 font-medium">מה שלומך היום?</p>
      </header>

      {!checkedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className={`
            w-72 h-72 rounded-full text-4xl font-bold shadow-[0_20px_50px_rgba(34,197,94,0.3)] 
            transition-all active:scale-90 border-[12px] border-white flex items-center justify-center
            ${loading ? 'bg-slate-300' : 'bg-[#22C55E] hover:bg-[#16A34A] text-white cursor-pointer'}
          `}
        >
          {loading ? 'שולח...' : 'אני בסדר! ✅'}
        </button>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-72 h-72 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center border-4 border-blue-100 shadow-inner">
            <span className="text-7xl mb-3">✔️</span>
            <span className="text-2xl font-bold">המשפחה עודכנה</span>
          </div>
          <p className="mt-8 text-lg text-slate-400 font-medium italic">
            לחיצה אחת וזהו. נתראה מחר!
          </p>
        </div>
      )}

      <footer className="mt-20">
        <p className="text-slate-300 text-sm uppercase tracking-widest font-bold">Senior Check-In</p>
      </footer>
    </main>
  );
}