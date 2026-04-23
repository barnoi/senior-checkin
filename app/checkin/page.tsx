'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Page() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [family, setFamily] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const fetchFamily = useCallback(async () => {
    // שליפה מה-LocalStorage וניקוי המייל (אותיות קטנות)
    const rawEmail = localStorage.getItem('senior_user_email');
    const userEmail = rawEmail ? rawEmail.toLowerCase().trim() : null;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('customer_email', userEmail) 
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      if (!data || data.length === 0) {
        // אם לא נמצאו נתונים, אנחנו לא מוחקים ישר את המייל (כדי לא לנתק משתמש בטעות)
        // אלא רק מאפסים את הרשימה
        setFamily([]);
      } else {
        setFamily(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    // בדיקה אם המשתמש הגיע מקישור במייל (עם ?email=...)
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    
    if (emailFromUrl) {
      // אם יש מייל בקישור, נשמור אותו בזיכרון של המכשיר
      const cleanEmail = emailFromUrl.toLowerCase().trim();
      localStorage.setItem('senior_user_email', cleanEmail);
    }
    
    // טעינת הנתונים (תשתמש במייל מהקישור או מהזיכרון השמור)
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
    if (loading || checkedIn) return;
    setLoading(true);
    try {
      const rawEmail = localStorage.getItem('senior_user_email');
      const userEmail = rawEmail ? rawEmail.toLowerCase().trim() : null;

      const response = await fetch('/api/send-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'broadcast', 
          email: userEmail,
          message: "אמא עדכנה שהכל בסדר! ❤️"
        }),
      });
      if (!response.ok) throw new Error('Failed');
      setCheckedIn(true);
      setTimeout(() => setCheckedIn(false), 15000);
    } catch (err) {
      alert("שגיאה בשליחה");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  if (loading && family.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <span className="text-slate-400 font-bold">טוען נתונים...</span>
      </div>
    );
  }

  if (family.length === 0) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center" dir="rtl">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-800 mb-2">גישה מוגבלת</h1>
          <p className="text-slate-600 mb-6 text-sm">המייל אינו מזוהה או שטרם הוגדרו מלווים.</p>
          <Link href="/landing" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg inline-block">חזרה להרשמה</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col items-center min-h-[90vh] overflow-hidden">
        
        <div className="absolute top-6 left-8 flex items-center gap-2 z-30">
          <span className="text-sm font-black text-slate-800 tracking-tighter">SeniorSafe</span>
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-black">S</span>
          </div>
        </div>

        <div className="text-center mt-16 mb-4 px-6 z-20 relative">
          <h1 className="text-2xl font-black text-slate-800">בוקר טוב, מה שלומך?</h1>
          <p className="text-slate-400 text-sm font-medium italic">המשפחה איתך תמיד</p>
        </div>

        <div className="relative flex items-center justify-center w-full aspect-square max-w-90 flex-1 -mt-5">
          {family.slice(0, 5).map((member, index) => {
            const pos = [{top:0,left:3},{top:5,left:65},{top:50,left:-3},{top:60,left:70},{top:70,left:25}][index];
            
            const rawImg = member.image_url || member.img || "";
            let finalImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
            
            if (rawImg.startsWith('data:')) {
              finalImage = rawImg;
            } else if (rawImg.startsWith('http')) {
              finalImage = `${rawImg}${rawImg.includes('?') ? '&' : '?'}v=${new Date().getTime()}`;
            }

            return (
              <div key={member.id || index} className="absolute flex flex-col items-center z-10" style={{ top: `${pos.top}%`, left: `${pos.left}%` }}>
                <button onClick={() => setSelectedMember(member)} className="flex flex-col items-center active:scale-95 transition-transform">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-slate-100">
                    <img src={finalImage} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="-mt-2.5 z-20 bg-white px-4 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md border border-slate-100">{member.name}</span>
                </button>
              </div>
            );
          })}

          <button
            onClick={handleCheckIn}
            disabled={loading || checkedIn}
            className={`relative z-20 w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-500 ${checkedIn ? 'bg-sky-500 translate-y-1' : 'bg-linear-to-b from-green-400 to-green-600 border-b-[6px] border-green-700 shadow-2xl active:border-b-0 active:translate-y-1'}`}
          >
            {loading ? <span className="font-bold">מעדכן...</span> : checkedIn ? <span className="text-6xl font-light">✓</span> : <div className="flex flex-col items-center"><span className="font-black text-2xl mb-1">אני בסדר!</span><span className="text-[15px] opacity-90">שיהיה יום נהדר</span></div>}
          </button>
        </div>

        {family.length > 0 && (
          <a href={`tel:${family[0].phone.replace(/\D/g, '')}`} className="absolute bottom-20 left-6 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-30 border-2 border-white">
            <span className="text-white text-xl">📞</span>
          </a>
        )}

        <div className="w-full bg-slate-50/80 border-t border-slate-100 p-5 mt-auto flex flex-col items-center z-40">
          <div className="flex gap-4 text-slate-500 text-[10px] font-bold mb-2 underline">
            <Link href="/terms">תנאי שימוש</Link>
            <Link href="/privacy">פרטיות</Link>
          </div>
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">SeniorSafe • Family Circle</p>
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl text-center flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-slate-400 p-2 font-bold text-xl">✕</button>
            <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden mb-4 shadow-md bg-slate-100">
               <img src={selectedMember.image_url?.startsWith('data:') ? selectedMember.image_url : (selectedMember.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}`)} className="w-full h-full object-cover" alt={selectedMember.name} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">לדבר עם {selectedMember.name}?</h2>
            <button onClick={() => sendPrivateNotification(selectedMember)} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg mb-4 shadow-lg active:scale-95 transition-transform">{sentStatus || "שלחי קריאה ✨"}</button>
            <button onClick={() => setSelectedMember(null)} className="text-slate-400 font-bold text-sm">ביטול</button>
          </div>
        </div>
      )}
    </main>
  );
}