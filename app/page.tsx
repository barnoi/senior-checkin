'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. הלקוח תמיד מחוץ לפונקציה כדי למנוע את ה"צהוב" בטרמינל
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  // 2. כל ה-Hooks חייבים להיות בתוך הפונקציה
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      // שמירה ב-Supabase
      const { error } = await supabase
        .from('checkins')
        .insert([{ status: 'ok' }]);

      if (error) throw error;

      // שליחת הודעה (ווטסאפ/מייל)
      await fetch('/api/send', { method: 'POST' });
      
      setCheckedIn(true);
    } catch (err) {
      console.error("Supabase Error:", err);
      alert("שגיאה בחיבור. ודאי שהמפתחות ב-env תקינים");
    } finally {
      setLoading(false);
    }
  };

  // 3. ה-Return (העיצוב המאיר והנפחי)
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] p-6 text-center font-sans">
      <header className="mb-16">
        <h1 className="text-5xl font-black text-slate-800 mb-3 tracking-tight">בוקר טוב אמא ❤️</h1>
        <p className="text-xl text-slate-500 font-medium italic">מה שלומך היום?</p>
      </header>

      {!checkedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className={`
            w-72 h-72 rounded-full text-4xl font-black shadow-2xl transition-all 
            flex items-center justify-center border-white border-8
            ${loading 
              ? 'bg-slate-300' 
              : 'bg-[#22C55E] text-white hover:translate-y-1 active:translate-y-4 active:shadow-inner border-b-[16px] border-green-700 shadow-[0_20px_40px_rgba(34,197,94,0.4)]'
            }
          `}
        >
          {loading ? 'מעדכן...' : 'אני בסדר! ✅'}
        </button>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-72 h-72 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center border-8 border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <span className="text-7xl mb-3">✔️</span>
            <span className="text-2xl font-black">המשפחה עודכנה</span>
          </div>
          <p className="mt-8 text-slate-400 font-bold italic tracking-wide">
            לחיצה אחת וזהו. נתראה מחר!
          </p>
        </div>
      )}

      <footer className="absolute bottom-8 text-slate-300 text-xs tracking-[0.3em] font-bold uppercase opacity-50">
        SeniorSafe © 2026
      </footer>
    </main>
  );
}