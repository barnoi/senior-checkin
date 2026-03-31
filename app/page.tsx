'use client';
import { useState } from 'react';
// 1. שינוי ה-Import לזה:
import { createClient } from '@supabase/supabase-js';

export default function SeniorPage() {
  // 2. יצירת ה-Client בצורה ישירה (ללא Helpers)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
   
    try {
      // 3. שמירה בטבלה
      const { error } = await supabase
        .from('checkins')
        .insert([{ status: 'ok' }]);

      if (error) throw error;

      // 4. שליחת מייל
      await fetch('/api/send', { method: 'POST' });
      
      setCheckedIn(true);
    } catch (err) {
      console.error("Supabase Error:", err);
      alert("שגיאה בחיבור. ודאי שהמפתחות ב-env תקינים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCF8] p-6 text-center">
      <header className="mb-16">
        <h1 className="text-5xl font-black text-slate-800 mb-3">בוקר טוב אמא ❤️</h1>
        <p className="text-xl text-slate-500">מה שלומך היום?</p>
      </header>

      {!checkedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className={`w-72 h-72 rounded-full text-4xl font-bold shadow-2xl transition-all active:scale-95 border-12 border-white flex items-center justify-center ${
            loading ? 'bg-slate-300' : 'bg-[#22C55E] text-white hover:bg-[#1ea34d]'
          }`}
        >
          {loading ? 'מעדכן...' : 'אני בסדר! ✅'}
        </button>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-72 h-72 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center border-4 border-blue-100 shadow-inner">
            <span className="text-7xl mb-3">✔️</span>
            <span className="text-2xl font-bold">המשפחה עודכנה</span>
          </div>
          <p className="mt-8 text-slate-400 italic">!לחיצה אחת וזהו. נתראה מחר</p>
        </div>
      )}

      <footer className="absolute bottom-8 text-slate-300 text-sm tracking-widest uppercase">
        Senior Check-In
      </footer>
    </main>
  );
}