'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import Link from 'next/link';

export default function Page() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [family, setFamily] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const fetchFamily = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setFamily(data);
    } catch (error) {
      console.error("Error fetching family:", error);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchFamily();
  }, [fetchFamily]);

  const sendPrivateNotification = async (member: any) => {
    setLoading(true);
    setSentStatus(`שולח ל${member.name}...`);
    try {
      await fetch('/api/send-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'private', 
          targetPhone: member.phone,
          message: `אמא רוצה לדבר עם ${member.name}! ✨` 
        }),
      });
      setSentStatus("נשלח!");
      setTimeout(() => {
        setSelectedMember(null);
        setSentStatus(null);
      }, 1500);
    } catch (err) {
      setSentStatus("שגיאה");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await fetch('/api/send-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'broadcast', 
          message: "אמא עדכנה שהכל בסדר! ❤️" 
        }),
      });
      setCheckedIn(true);
      setTimeout(() => setCheckedIn(false), 15000);
    } catch (err) {
      alert("שגיאה בעדכון");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
      
      {/* המסגרת הראשית */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col items-center min-h-[90vh] overflow-hidden">
        
        {/* לוגו ושם בצד שמאל למעלה */}
        <div className="absolute top-6 left-8 flex items-center gap-2 z-30">
          <span className="text-sm font-black text-slate-800 tracking-tighter">SeniorSafe</span>
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-black">S</span>
          </div>
        </div>

        {/* כותרת ברוך הבא */}
        <div className="text-center mt-16 mb-4 px-6 z-20 relative">
          <h1 className="text-2xl font-black text-slate-800">בוקר טוב, מה שלומך?</h1>
          <p className="text-slate-400 text-sm font-medium italic">המשפחה איתך תמיד</p>
        </div>

        {/* פריסת העיגול - המיקומים המדויקים שלך נשמרו כאן */}
        <div className="relative flex items-center justify-center w-full aspect-square max-w-90 flex-1 -mt-5">
          {family.slice(0, 5).map((member, index) => {
            const fixedPositions = [
              { top: 0, left: 3 },   { top: 5, left: 65 },  
              { top: 50, left: -3 }, { top: 60, left: 70 }, 
              { top: 70, left: 25 }   
            ];
            const pos = fixedPositions[index];
            
            let cleanUrl = (member.image_url || member.img || "").match(/(https?:\/\/[^\s\]\)]+)/)?.[0] || "";
            const finalImage = cleanUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;

            return (
              <div key={member.id || index} className="absolute flex flex-col items-center z-10" style={{ top: `${pos.top}%`, left: `${pos.left}%` }}>
                <button onClick={() => setSelectedMember(member)} className="flex flex-col items-center group active:scale-95 transition-transform">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-slate-100 bg-slate-50">
                    <img src={finalImage} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="-mt-2.5 z-20 bg-white/95 px-4 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md border border-slate-100">
                    {member.name}
                  </span>
                </button>
              </div>
            );
          })}

          {/* הכפתור המרכזי */}
          <button
            onClick={handleCheckIn}
            disabled={loading || checkedIn}
            className={`relative z-20 w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-500
              ${checkedIn 
                ? 'bg-sky-500 shadow-inner translate-y-1' 
                : 'bg-linear-to-b from-green-400 to-green-600 border-b-[6px] border-green-700 shadow-2xl active:border-b-0 active:translate-y-1'}`}
          >
            {loading ? (
               <span className="font-bold">מעדכן...</span>
            ) : checkedIn ? (
               <span className="text-6xl font-light">✓</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-black text-2xl mb-1">אני בסדר!</span>
                <span className="font-medium text-[15px] opacity-90">שיהיה יום נהדר</span>
              </div>
            )}
          </button>
        </div>

        {/* SOS */}
        {family.length > 0 && (
          <a 
            href={`tel:${family[0].phone.replace(/\D/g, '')}`}
            className="absolute bottom-20 left-6 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-30 border-2 border-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.143-7.143c-.155-.441.011-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </a>
        )}

        {/* פוטר */}
        <div className="w-full bg-slate-50/80 border-t border-slate-100 p-5 mt-auto flex flex-col items-center z-40">
          <div className="flex gap-4 text-slate-500 text-[10px] font-bold mb-2 underline">
            <Link href="/terms" className="hover:text-blue-600">תנאי שימוש</Link>
            <Link href="/privacy" className="hover:text-blue-600">פרטיות</Link>
            <a href="mailto:hello@communicateclever.com" className="hover:text-blue-600">תמיכה</a>
          </div>
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
            SeniorSafe • Family Circle
          </p>
        </div>
      </div>

      {/* מודאל הודעה פרטית עם כפתור X וסגירה בלחיצה על הרקע */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-white rounded-4xl p-8 w-full max-w-xs shadow-2xl text-center flex flex-col items-center border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* כפתור ה-X החדש */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden mb-4 shadow-md bg-slate-100">
               <img src={selectedMember.image_url || selectedMember.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}`} className="w-full h-full object-cover" alt={selectedMember.name} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans">לדבר עם {selectedMember.name}?</h2>
            <button
              onClick={() => sendPrivateNotification(selectedMember)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg mb-4 shadow-lg active:scale-95 transition-transform"
            >
              {sentStatus || "שלחי קריאה ✨"}
            </button>
            <button onClick={() => setSelectedMember(null)} className="text-slate-400 font-bold hover:text-slate-600 transition">ביטול / חזרה</button>
          </div>
        </div>
      )}
    </main>
  );
}