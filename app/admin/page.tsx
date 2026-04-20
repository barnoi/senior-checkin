'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Plus, Trash2, Home, ImageIcon, Phone, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');
  
  // תוספת קטנה עבור האישור המשפטי
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const fetchFamily = useCallback(async () => {
    const userEmail = localStorage.getItem('senior_user_email');
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchFamily();
  }, [fetchFamily]);

  const handleLocalChange = (index: number, field: string, value: string) => {
    const newFamily = [...family];
    newFamily[index] = { ...newFamily[index], [field]: value };
    setFamily(newFamily);
  };

  const saveAll = async () => {
    // בדיקת הגנה: אם לא אישרו את התנאים, לא שומרים
    if (!agreedToTerms) {
      alert("יש לאשר את הסכמת המלווים ותנאי השימוש לפני השמירה.");
      return;
    }

    setLoading(true);
    setMessage('שומר שינויים...');
    const userEmail = localStorage.getItem('senior_user_email');

    if (!userEmail) {
      alert("שגיאה: מייל משתמש לא נמצא.");
      setLoading(false);
      return;
    }

    try {
      for (const member of family) {
        const payload = {
          name: member.name,
          phone: member.phone,
          image_url: member.image_url,
          customer_email: userEmail
        };

        if (member.id) {
          const { error } = await supabase
            .from('contacts')
            .update({
              name: member.name,
              phone: member.phone,
              image_url: member.image_url
            })
            .eq('id', member.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('contacts')
            .insert([payload]);
          if (error) throw error;
        }
      }

      setMessage('הכל נשמר בהצלחה! ✨');
      setTimeout(() => {
        window.location.href = '/checkin';
      }, 2000);

    } catch (err: any) {
      console.error('Save error:', err);
      alert("שגיאה בשמירה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEmptyRow = () => {
    setFamily([...family, { name: '', phone: '', image_url: '' }]);
  };

  const removeMember = async (id: string, index: number) => {
    if (!confirm('למחוק את המלווה?')) return;
    
    try {
      if (id) {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
      const newFamily = [...family];
      newFamily.splice(index, 1);
      setFamily(newFamily);
      setMessage('המלווה נמחק');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      alert("שגיאה במחיקה");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-right" dir="rtl">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">ניהול מלווים</h1>
              <p className="text-slate-500 font-medium">עדכני את פרטי המשפחה והתמונות</p>
            </div>
            <Link href="/checkin" className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              <Home size={24} />
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
             <div className="bg-blue-500 p-1 rounded-full text-white mt-1"><Eye size={14} /></div>
             <p className="text-sm text-blue-800 leading-relaxed">
               <strong>טיפ:</strong> חמשת המלווים הראשונים יופיעו עם תמונה במסך הראשי של ההורה. כל מלווה נוסף יקבל את הודעות העדכון כרגיל, אך ללא הצגת תמונה.
             </p>
          </div>

          {/* תיבת אישור משפטי חדשה */}
          <div className={`mb-6 p-5 rounded-2xl border-2 transition-all ${agreedToTerms ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-bold text-slate-700 leading-snug">
                אני מאשר/ת כי קיבלתי את הסכמת המלווים להוספתם למערכת, וכי קראתי והסכמתי ל
                <Link href="/terms" className="text-blue-600 underline mx-1">תנאי השימוש</Link> 
                ול
                <Link href="/privacy" className="text-blue-600 underline mx-1">מדיניות הפרטיות</Link>.
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveAll}
              disabled={loading || !agreedToTerms}
              className={`flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2
                ${agreedToTerms 
                  ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
              {loading ? <span className="animate-pulse">שומר שינויים...</span> : <><Save size={20} /> שמור את כל השינויים</>}
            </button>
            
            <button
              onClick={addEmptyRow}
              className="px-6 bg-white text-blue-600 border-2 border-blue-50 py-4 rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-blue-600 text-white rounded-2xl text-center font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                {message}
              </div>
            </div>
          )}
        </header>

        {/* List */}
        <div className="space-y-6">
          {family.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-lg">אין עדיין מלווים ברשימה.<br/>לחצי על ה- + כדי להתחיל.</p>
            </div>
          )}

          {family.map((member, index) => {
            const isVisible = index < 5;
            return (
              <div key={member.id || `new-${index}`} 
                className={`relative p-6 md:p-8 rounded-[2.5rem] shadow-sm border transition-all hover:shadow-md ${isVisible ? 'bg-white border-slate-200' : 'bg-slate-50/50 border-dashed border-slate-300 opacity-80'}`}
              >
                
                <button 
                  onClick={() => removeMember(member.id, index)}
                  className="absolute top-6 left-6 text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${isVisible ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isVisible ? (
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                        <Eye size={12} /> מלווה גלוי (עם תמונה)
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <EyeOff size={12} /> מלווה שקט (עדכון בלבד)
                      </span>
                    )}
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* שם המלווה */}
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
      <User size={16} className="text-blue-500" /> שם המלווה
    </label>
    <input 
      placeholder="למשל: עמית"
      className="w-full p-4 bg-white border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
      value={member.name || ''}
      onChange={(e) => handleLocalChange(index, 'name', e.target.value)}
    />
  </div>

  {/* מספר טלפון */}
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
      <Phone size={16} className="text-green-500" /> מספר טלפון
    </label>
    <input 
      placeholder="050-0000000"
      className="w-full p-4 bg-white border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-left transition-all"
      value={member.phone || ''}
      onChange={(e) => handleLocalChange(index, 'phone', e.target.value)}
    />
  </div>

  {/* בחירת שעת יעד לעדכון - כאן ה"פלא" */}
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
      <span className="text-blue-500">⏰</span> מתי ההורה נוהג לעדכן?
    </label>
    <select 
      className="w-full p-4 bg-white border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-700 shadow-sm"
      // הערה: ניתן להוסיף שדה target_hour ל-State כדי לשמור את הבחירה ויזואלית
      onChange={(e) => {
        const targetHour = parseInt(e.target.value);
        const alertHour = (targetHour + 2).toString().padStart(2, '0') + ":00";
        handleLocalChange(index, 'alert_time', alertHour);
      }}
    >
      <option value="06">06:00 בבוקר</option>
      <option value="07">07:00 בבוקר</option>
      <option value="08">08:00 בבוקר</option>
      <option value="09" selected>09:00 בבוקר</option>
      <option value="10">10:00 בבוקר</option>
      <option value="11">11:00 בבוקר</option>
      <option value="12">12:00 בצהריים</option>
      <option value="13">13:00 בצהריים</option>
    </select>
    <p className="text-[10px] text-blue-600 font-bold mr-1 italic">
      * המערכת תשלח התראה שעתיים אחרי השעה שתבחרו.
    </p>
  </div>

  {/* קישור לתמונה */}
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-1">
      <ImageIcon size={16} className="text-purple-500" /> קישור לתמונה {isVisible ? '' : '(לא חובה)'}
    </label>
    <div className="flex gap-4 items-center">
      <div className={`relative w-16 h-16 rounded-2xl border overflow-hidden shrink-0 shadow-inner ${isVisible ? 'bg-slate-100 border-slate-200' : 'bg-slate-200 border-slate-300 opacity-50'}`}>
        {member.image_url ? (
          <img src={member.image_url} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageIcon size={24} />
          </div>
        )}
      </div>
      <input 
        placeholder="הדביקי כאן קישור לתמונה"
        className="flex-1 p-4 bg-white border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-xs text-slate-500 transition-all"
        value={member.image_url || ''}
        onChange={(e) => handleLocalChange(index, 'image_url', e.target.value)}
      />
    </div>
  </div>
</div>
              </div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-slate-400 text-xs font-medium pb-10">
          שימי לב: חמשת המקומות הראשונים שמורים למשפחה הגרעינית שתופיע על המסך
        </footer>
      </div>
    </div>
  );
}