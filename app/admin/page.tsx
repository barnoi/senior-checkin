'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // תיקון Hydration
  const [message, setMessage] = useState('');

  const fetchFamily = useCallback(async () => {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setFamily(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchFamily();
  }, [fetchFamily]);

  // פונקציה שמנקה את ה-URL לפני השמירה (פותר את בעיית ה-404)
  const cleanUrl = (url: string) => {
    const match = url.match(/(https?:\/\/[^\s\]\)]+)/);
    return match ? match[0] : url.replace(/[\[\]\(\)]/g, '').trim();
  };

  async function updateMember(id: string, updates: any) {
    // אם מעדכנים תמונה, ננקה את הקישור קודם
    if (updates.image_url) {
      updates.image_url = cleanUrl(updates.image_url);
    }

    const { error } = await supabase.from('contacts').update(updates).eq('id', id);
    if (error) {
      alert("שגיאה בעדכון");
    } else {
      setMessage('הנתונים נשמרו בהצלחה!');
      setTimeout(() => setMessage(''), 3000);
      fetchFamily();
    }
  }

  // מונע את שגיאת ה-Component mismatch ב-Next.js
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">ניהול מלווים</h1>
              <p className="text-slate-500">עדכני כאן שמות, טלפונים ותמונות שיופיעו אצל אמא</p>
            </div>
            <a href="/" className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm border hover:bg-slate-100 transition-colors">
              🏠 חזרה למסך אמא
            </a>
          </div>
          {message && <div className="mt-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-pulse text-center font-bold">{message}</div>}
        </header>

        {loading ? (
          <div className="p-10 text-center text-slate-400">טוען נתונים...</div>
        ) : (
          <div className="space-y-6">
            {family.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
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
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-left"
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
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-200">
                        <img 
                          src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=X'; }}
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