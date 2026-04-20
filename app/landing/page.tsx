'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PayPalButton from '../components/PayPalButton';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [paid, setPaid] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false); // הוספת מצב טעינה לבדיקת המייל
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    { name: "מיכל כהן", role: "בת לניצול שואה", text: "זה שינה לנו את הבוקר. במקום להתקשר בלחץ, אני מקבלת הודעה כשהיא שותה את הקפה." },
    { name: "דני לוי", role: "בן להורה יחיד", text: "סוף סוף אבא מרגיש שאני לא מעיק עליו, ואני רגוע שהוא התעורר והכל בסדר." },
    { name: "רחל אברהם", role: "סבתא ל-12", text: "הכפתור הירוק כל כך פשוט. אני לוחצת וכל הילדים שלי יודעים מיד שאני בסדר." },
    { name: "יוסי מזרחי", role: "מנהל הייטק", text: "השירות הזה נותן לי שקט נפשי באמצע יום עבודה עמוס. פשוט ויעיל." },
    { name: "אורית גל", role: "בת להורים בקיבוץ", text: "התראת ה-'לא עודכן' היא מצילת חיים. פעם אחת אמא שכחה והלכנו לבדוק אותה מיד." },
    { name: "שמואל כץ", role: "גמלאי", text: "אני מרגיש בטוח יותר בידיעה שהמשפחה שלי מחוברת אליי בלחיצת כפור." }
  ];

  if (!mounted) return null;

  // פונקציית כניסה משופרת שבאמת בודקת בסופבייס
  const handleExistingUserLogin = async () => {
    const email = prompt("אנא הזן את האימייל איתו נרשמת למערכת:");
    if (!email || !email.includes('@')) {
      if (email) alert("נא להזין כתובת מייל תקינה");
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // בדיקה בטבלת contacts כדי לראות אם יש מלווים רשומים למייל הזה
      const { data, error } = await supabase
        .from('contacts')
        .select('customer_email')
        .eq('customer_email', cleanEmail)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        localStorage.setItem('senior_user_email', cleanEmail);
        router.push('/admin'); 
      } else {
        alert("המייל אינו רשום במערכת. יש להירשם כמנוי תחילה.");
      }
    } catch (err) {
      alert("שגיאה בחיבור לשרת. נסו שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-right text-slate-900" dir="rtl" suppressHydrationWarning>
      
      {/* Navbar המעודכן */}
      <nav className="p-6 max-w-6xl mx-auto flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">SeniorSafe</div>
        <div className="flex gap-6 items-center">
          <Link href="/about" className="text-slate-500 font-bold hover:text-blue-600 transition text-sm">הסיפור שלנו</Link>
          <button 
            onClick={handleExistingUserLogin}
            disabled={loading}
            className="bg-slate-100 px-4 py-2 rounded-lg text-slate-700 font-bold hover:bg-blue-600 hover:text-white transition text-sm disabled:opacity-50"
          >
            {loading ? 'בודק...' : 'ניהול מלווים (לרשומים)'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center text-right">
        <div>
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-xs font-bold mb-4 inline-block italic">
            SENIORSAFE • פותח על ידי מרפאה בעיסוק מומחית לגיל השלישי
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-800 tracking-tight">
            הדרך המכבדת לשמור <br/>
            על <span className="text-blue-600">העצמאות של ההורים.</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-600 mb-6 leading-relaxed">
            השקט הנפשי שלכם, החופש שלהם. 
          </h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg font-medium">
            בלי שיחות תחקור מעיקות ובלי להפריע לסדר היום. 
            מערכת עדכון בוקר שמאפשרת להורים לשלוח "הכל בסדר" בלחיצת כפתור אחת פשוטה.
          </p>
          <button 
            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl hover:scale-105"
          >
            אני רוצה להצטרף למייסדים
          </button>
        </div>

        <div className="relative justify-self-center">
          <div className="relative mx-auto w-70 h-145 bg-slate-900 rounded-[3rem] border-12 border-slate-900 shadow-2xl overflow-hidden ring-8 ring-slate-100/50 transform rotate-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
            </div>
            <div className="relative w-full h-full bg-white overflow-hidden">
              <img 
                src="/app-screenshot.png" 
                alt="SeniorSafe App Interface" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]"></div>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>
      </header>

      {/* הסיפור האישי */}
      <section className="py-16 px-6 bg-blue-50/50 border-y border-blue-100 font-medium leading-relaxed">
        <div className="max-w-4xl mx-auto text-right">
          <h2 className="text-3xl font-black text-slate-800 mb-8 underline decoration-blue-500 decoration-4 underline-offset-8">למה פיתחתי את SeniorSafe?</h2>
          <div className="prose prose-lg text-slate-700">
            <p className="mb-4">נעים מאוד, אני מרפאה בעיסוק, עובדת עם הדור השלישי ובת להורים מבוגרים. במשך שנים ראיתי את המורכבות הזו מהצד המקצועי...</p>
            <p className="mb-4">הסיפור האישי שלי התחיל בכל בוקר מחדש, כשהלב שלי היה מחסיר פעימה: <span className="text-blue-700 italic font-bold">"האם להתקשר עכשיו? אולי הם עוד ישנים? אולי קרה משהו והם לא יכולים לענות?"</span></p>
            <p className="mb-6 italic text-slate-600">מצאתי את עצמי במלכודת – מצד אחד דאגה עמוקה, ומצד שני חוסר נעימות להפוך כל שיחה ל"בדיקת נוכחות" מעיקה. הבנתי שחסר לנו גשר דיגיטלי חם ומכבד.</p>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-2xl font-black mb-10 italic text-slate-700">המתח שבלב, כל בוקר מחדש...</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto font-bold">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 italic text-slate-600">"לחכות לטלפון בבוקר ולתהות אם הכל בסדר..."</div>
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 italic text-slate-600">"להרגיש שאני מעיקה עליהם כשאני רק רוצה לוודא..."</div>
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 italic text-slate-600">"החשש שהם שכחו להודיע, אבל הלב כבר בלחץ."</div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-20 bg-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16">איך זה עובד? ב-4 שלבים פשוטים</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "נרשמים", desc: "בוחרים עד 5 בני משפחה שיקבלו את העדכונים." },
              { num: "02", title: "הלחיצה", desc: "ההורה לוחץ על הכפתור הירוק בבוקר מהנייד." },
              { num: "03", title: "שקט", desc: "כל המשפחה מקבלת הודעה אוטומטית שהכל בסדר." },
              { num: "04", title: "ביטחון", desc: "התראה מיידית אם לא בוצע עדכון בזמן שנקבע." }
            ].map((step, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl shadow-sm text-center border border-slate-200">
                <div className="text-blue-500 font-black text-4xl mb-4">{step.num}</div>
                <h3 className="font-black text-lg mb-2 text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-right">
          <h2 className="text-3xl font-black text-center mb-16 text-slate-800 tracking-tighter italic">מה המשפחות שלנו אומרות</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition italic">
                <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">"{t.text}"</p>
                <div className="font-black text-slate-800 text-sm">{t.name}</div>
                <div className="text-blue-600 text-xs font-bold">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="offer" className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border-b-12 border-blue-600">
          <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-black absolute -top-1 left-1/2 transform -translate-x-1/2 text-sm uppercase tracking-widest">נשארו 50 מקומות אחרונים למייסדים</div>
          <div className="mt-6">
            <h3 className="text-4xl font-black mb-4">חבילת Founders</h3>
            <div className="flex justify-center items-center gap-6 mb-4">
               <span className="text-slate-500 line-through text-2xl font-bold">₪49 לחודש</span>
               <span className="text-7xl font-black text-white tracking-tighter">₪199</span>
            </div>
            <p className="text-xl font-black mb-10 text-blue-400 italic underline">תשלום חד-פעמי לכל החיים!</p>
            <div className="max-w-sm mx-auto">
              {!paid ? (
                !showPayment ? (
                  <button onClick={() => setShowPayment(true)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-2xl hover:bg-blue-700 transition shadow-xl active:scale-95 animate-bounce">אני רוצה להצטרף</button>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-inner min-h-37.5 flex flex-col items-center justify-center">
                    <p className="text-xs text-blue-600 font-black mb-4 italic">** מצב בדיקה פעיל: המחיר הוא 1 ש"ח **</p>
                    <PayPalButton 
                      amount="1.00" 
                      onSuccess={async (details) => {
                        setPaid(true);
                        setTimeout(() => { window.location.href = "/admin"; }, 2000);
                      }} 
                    />
                  </div>
                )
              ) : (
                <div className="text-green-400 font-black p-4 bg-green-400/10 rounded-2xl border border-green-400/30 text-xl text-center">🎉 ברוכים הבאים!<br/>מעביר אתכם למערכת...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Referral System */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl mb-6">🎁</div>
          <h2 className="text-3xl font-black mb-4 italic text-white">אוהבים לעזור? קבלו מנוי מתנה!</h2>
          <p className="text-xl mb-10 opacity-90 font-medium leading-relaxed">הפיצו את הבשורה ל-5 חברים. ברגע ש-5 מהם מצטרפים, תקבלו מנוי לכל החיים במתנה!</p>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 inline-block w-full max-w-xl text-right">
            <div className="space-y-4 mb-10 font-bold italic">
              <div className="flex gap-4 items-start"><span className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">1</span><p>משתפים את הקישור שלכם בווטסאפ.</p></div>
              <div className="flex gap-4 items-start"><span className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">2</span><p>החברים נרשמים ומקבלים שקט נפשי.</p></div>
              <div className="flex gap-4 items-start"><span className="bg-yellow-400 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">3</span><p>מקבלים מאיתנו קוד קופון למנוי חינם נוסף.</p></div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" readOnly value="https://senior.communicateclever.com" className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm font-mono text-center text-white" />
              <button onClick={() => { navigator.clipboard.writeText("https://senior.communicateclever.com"); alert("הועתק!"); }} className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-xl font-black hover:bg-yellow-300 transition">העתקת קישור</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-right">
          <h2 className="text-3xl font-black text-center mb-12 text-slate-800">שאלות ותשובות (FAQ)</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100"><h3 className="font-black text-lg text-blue-700 mb-2">איך מוסיפים את SeniorSafe כ"אייקון"?</h3><p className="text-slate-700 font-medium">באייפון: לחצו על כפתור ה-"שתף" ובחרו "הוסף למסך הבית".</p></div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100"><h3 className="font-black text-lg text-blue-600 mb-2">איך אני מוצא/ת קישור לתמונה?</h3><p className="text-slate-600 font-medium">בוואטסאפ מחשב: קליק ימני על תמונה ו"העתק כתובת תמונה".</p></div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100"><h3 className="font-black text-lg text-blue-600 mb-2">מה קורה אם אמא שוכחת?</h3><p className="text-slate-600 font-medium">המערכת תשלח הודעה אוטומטית לכל המלווים.</p></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-xs font-bold">
        <div className="flex justify-center gap-6 mb-6 text-slate-600 underline italic">
          <Link href="/terms">תנאי שימוש</Link>
          <Link href="/privacy">פרטיות</Link>
        </div>
        <p className="tracking-widest opacity-60">© 2026 SeniorSafe • hello@communicateclever.com</p>
      </footer>
    </div>
  );
}