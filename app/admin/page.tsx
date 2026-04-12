'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFamily = useCallback(async (email?: string) => {
    const userEmail = email || localStorage.getItem('senior_user_email');
    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('customer_email', userEmail)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setFamily(data);
    } catch (err) {
      console.error('Error fetching family:', err);
    } finally {
      // מבטיח שהטעינה תיעצר בכל מקרה, מה שמונע מסך תקוע
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const userEmail = localStorage.getItem('senior_user_email');

    if (userEmail) {
      // שליחת מייל ברוכים הבאים (אופציונלי, רץ ברקע)
      fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      }).catch(err => console.error('Failed to send welcome email:', err));

      fetchFamily(userEmail);
    } else {
      setLoading(false);
    }
  }, [fetchFamily]);

  const cleanUrl = (url: string) => {
    const match = url.match(/(https?:\/\/[^\s\]\)]+)/);
    return match ? match[0] : url.replace(/[\[\]\(\)]/g, '').trim();
  };

  async function updateMember(id: string, updates: any) {
    if (updates.image_url) {
      updates.image_url = cleanUrl(updates.image_url);
    }

    try {
      const { error } = await supabase.from('contacts').update(updates).eq('id', id);
      if (error) throw error;
      
      setMessage('הנתונים נשמרו בהצלחה!');
      setTimeout(() => setMessage(''), 3000);
      
      const userEmail = localStorage.getItem('senior_user_email');
      if (userEmail) fetchFamily(userEmail);
    } catch (err) {
      console.error('Update error:', err);
      alert("שגיאה בעדכון");
    }
  }

  async function addMember() {
    const userEmail = localStorage.getItem('senior_user_email');
    if (!userEmail) return;

    setLoading(true);
    try {
      // הגדרת המשתנה בתוך הפונקציה כדי ש-TypeScript יזהה אותו
      const newMember = {
        name: "מלווה חדש",
        phone: "",
        customer_email: userEmail,
        image_url: ""
      };

      // שימוש במשתנה מיד לאחר הגדרתו
      const { error } = await supabase.from('contacts').insert([newMember]);
      
      if (error) throw error;
      
      setMessage('מלווה חדש נוסף!');
      setTimeout(() => setMessage(''), 3000);
      await fetchFamily(userEmail);
    } catch (err) {
      console.error('Insert error:', err);
      alert("שגיאה בהוספת מלווה");
    } finally {
      setLoading(false); // מבטיח שחרור של המסך בכל מקרה
    }
  }
  // פתרון Hydration סופי:
  // ה-suppressHydrationWarning מונע מהתוסף Incognito לגרום לקריסה
  if (!isMounted) {
    return (
      <div 
        className="min-h-screen bg-white" 
        suppressHydrationWarning={true} 
      />
    );
  }

  return (
    // כאן מתחיל ה-JSX שלך...
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">ניהול מלווים</h1>
              <p className="text-slate-500 text-sm">עדכני כאן שמות, טלפונים ותמונות שיופיעו אצל אמא</p>
            </div>
            <a href="/" className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm border hover:bg-slate-100 transition-colors">
              🏠 חזרה למסך אמא
            </a>
          </div>
         <button
            onClick={addMember}
            className="w-full mb-6 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            הוסף מלווה חדש
          </button>

          {/* שורת הברכה החדשה */}
          <div className="bg-green-50 border-r-4 border-green-500 p-4 mt-6 mb-2 rounded-l-xl shadow-sm">
            <p className="text-green-800 font-bold text-lg">
              ✨ ברוכים הבאים ל-SeniorSafe! שמחים שהצטרפתם אלינו.
            </p>
            <p className="text-green-700 text-sm">
              כאן מגדירים את אנשי הקשר שיקבלו את העדכונים מאמא.
            </p>
          </div>

          {message && (
            <div className="mt-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-pulse text-center font-bold">
              {message}
            </div>
          )}
        </header>

        {/* בועת הנחיה בולטת - כעת היא תמיד גלויה כדי שהמסך לא ייראה ריק */}
        <div className="bg-amber-50 border-r-4 border-amber-400 p-4 mb-6 rounded-l-xl shadow-sm">
          <p className="text-sm text-amber-800 font-bold">
            💡 שימו לב: המלווה הראשון ברשימה (מס' 1) הוא איש הקשר שיופיע בכפתור הקישור המהיר אצל אמא.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400 italic animate-pulse">
            טוען נתונים מהמערכת...
          </div>
        ) : family.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="font-bold text-lg mb-2">עדיין לא הוספת מלווים.</p>
            <p className="text-sm">לחצי על הכפתור הירוק למעלה כדי להתחיל!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {family.map((member, index) => (
              <div key={member.id} className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
                {/* מספר סידורי צף */}
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10 border-2 border-white">
                  {index + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">שם המלווה</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                      defaultValue={member.name}
                      onBlur={(e) => updateMember(member.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">מספר טלפון</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-left font-sans"
                      defaultValue={member.phone}
                      onBlur={(e) => updateMember(member.id, { phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">קישור לתמונה (URL)</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-xs text-slate-500 font-mono"
                        defaultValue={member.image_url}
                        onBlur={(e) => updateMember(member.id, { image_url: e.target.value })}
                        placeholder="https://..."
                      />
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-200">
                        <img 
                          src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`; }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
          Senior Checkin Admin Panel
        </footer>
      </div>
    </div>
  );
}