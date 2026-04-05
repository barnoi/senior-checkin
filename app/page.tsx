'use client';
import { useState } from 'react';
export default function Page() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // רשימת בני המשפחה - כאן הילדים יוכלו לעדכן את הפרטים שלהם
  const family = [
    { name: "דני", phone: "0501112222", img: "https://i.pravatar.cc/150?u=1" },
    { name: "מיכל", phone: "0543334444", img: "https://i.pravatar.cc/150?u=2" },
    { name: "נועה", phone: "0525556666", img: "https://i.pravatar.cc/150?u=3" },
    { name: "יוסי", phone: "0537778888", img: "https://i.pravatar.cc/150?u=4" },
  ];

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      // כאן יבוא החיבור ל-API של הווטסאפ שנפתח בהמשך
      await fetch('/api/send', { method: 'POST' });
      setCheckedIn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="relative min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 overflow-hidden font-sans" dir="rtl">
      
      {/* כותרת עליונה */}
      <div className="absolute top-12 text-center animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">בוקר טוב אמא ❤️</h1>
        <p className="text-slate-400 font-bold mt-2 italic">כולם כאן איתך</p>
      </div>

      {/* אזור הלחצן והתמונות המפוזרות */}
      <div className="relative flex items-center justify-center w-full max-w-sm aspect-square">
        
        {/* פיזור תמונות בני המשפחה מסביב */}
        <div className="absolute inset-0">
          {family.map((member, index) => {
            // חישוב זוויות לפיזור מסביב לעיגול
            const angles = [45, 135, 225, 315]; 
            const angle = angles[index % angles.length];
            const radius = 135; // מרחק מהמרכז
            
            return (
              <a
                key={member.name}
                href={`tel:${member.phone}`}
                className="absolute transition-all hover:scale-115 active:scale-90 z-20"
                style={{
                  transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                  left: 'calc(50% - 36px)', 
                  top: 'calc(50% - 36px)',
                }}
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white ring-2 ring-slate-100">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale-15 hover:grayscale-0 transition-all" 
                  />
                </div>
              </a>
            );
          })}
        </div>

        {/* הלחצן המרכזי הירוק */}
        {!checkedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="
              relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full text-3xl font-black
              bg-[#22C55E] text-white border-green-7 border-8
              border-b-16 border-green-700
              shadow-[0_20px_50px_rgba(34,197,94,0.3)]
              active:translate-y-4 active:border-b-0
              transition-all duration-75
              flex items-center justify-center
            "
          >
            {loading ? 'שולח...' : 'אני בסדר! ✅'}
          </button>
        ) : (
          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white flex flex-col items-center justify-center border-8 border-slate-50 shadow-inner animate-in zoom-in duration-500">
             <span className="text-6xl mb-2">✨</span>
             <span className="text-xl font-black text-blue-600">הודעה נשלחה</span>
             <span className="text-sm text-slate-400 mt-1 font-bold">אוהבים אותך!</span>
          </div>
        )}
      </div>

      {/* קרדיט תחתון עדין */}
      <footer className="absolute bottom-8 opacity-20 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
        SeniorSafe • Family Circle
      </footer>
    </main>
  );
}