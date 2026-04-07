'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
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

  // שליחה אישית
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

  // שליחה כללית "אני בסדר"
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
      
      // משנה את הכפתור לכחול ("עודכן!")
      setCheckedIn(true);

      // מחזיר את הכפתור למצב ירוק ("אני בסדר!") אחרי 5 שניות
      setTimeout(() => {
        setCheckedIn(false);
      }, 5000);

    } catch (err) {
      alert("שגיאה בעדכון");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 overflow-hidden font-sans" dir="rtl">
      
      <div className="absolute top-12 text-center">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">בוקר טוב, מה שלומך?</h1>
        <p className="text-slate-500 font-medium mt-2 italic text-lg opacity-80">המשפחה איתך תמיד</p>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-sm aspect-square">
        {family.slice(0, 5).map((member, index) => {
          const fixedPositions = [
            { top: 5, left: 10 }, { top: 15, left: 75 },
            { top: 70, left: 5 }, { top: 80, left: 70 },
            { top: 100, left: 40 }
          ];
          const pos = fixedPositions[index];
          
          let cleanUrl = (member.image_url || member.img || "").match(/(https?:\/\/[^\s\]\)]+)/)?.[0] || "";
          if (cleanUrl.startsWith('https:/') && !cleanUrl.startsWith('https://')) cleanUrl = cleanUrl.replace('https:/', 'https://');
          const finalImage = cleanUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;

          return (
            <div key={member.id || index} className="absolute flex flex-col items-center" style={{ top: `${pos.top}%`, left: `${pos.left}%` }}>
              <button onClick={() => setSelectedMember(member)} className="group relative flex flex-col items-center hover:scale-110 active:scale-95 transition-transform">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden mb-1 ring-4 ring-white/10 bg-slate-100">
                  <img src={finalImage} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <span className="bg-white/90 px-4 py-1 rounded-full text-sm font-bold text-gray-800 shadow-md">{member.name}</span>
              </button>
            </div>
          );
        })}

        <button
          onClick={handleCheckIn}
          disabled={loading || checkedIn}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-black text-2xl transition-all duration-700 shadow-2xl
            ${checkedIn ? 'bg-sky-500' : 'bg-gradient-to-br from-green-400 to-green-600'}`}
        >
          {loading ? "מעדכן..." : checkedIn ? "עודכן! ✓" : "אני בסדר!"}
        </button>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs shadow-2xl text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden mb-4 shadow-lg">
               <img src={selectedMember.image_url || selectedMember.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}`} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">לדבר עם {selectedMember.name}?</h2>
            
            <button
              onClick={() => sendPrivateNotification(selectedMember)}
              disabled={loading}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-xl mb-4 shadow-lg active:scale-95 transition-transform"
            >
              {sentStatus || "שלחי קריאה"}
            </button>

            <button onClick={() => setSelectedMember(null)} className="text-slate-400 font-bold">ביטול / חזרה</button>
          </div>
        </div>
      )}
       {/* כפתור חיוג מהיר - צף בצד */}
{family.length > 0 && (
  <a 
    href={`tel:${family[0].phone.replace(/\D/g, '')}`}
    className="fixed bottom-8 left-8 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
    title="חיוג מהיר"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="white" 
      className="w-8 h-8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.143-7.143c-.155-.441.011-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  </a>
)}
      <footer className="absolute bottom-8 opacity-20 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
        SeniorSafe • Family Circle
      </footer>
    </main>
  );
}