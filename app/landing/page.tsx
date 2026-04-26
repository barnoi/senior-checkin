'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PayPalButton from '../components/PayPalButton';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'] });

export default function LandingPage() {
  const [paid, setPaid] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const router = useRouter();
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      const { count } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      setSpotsLeft(Math.max(0, 50 - (count || 0)));
    };
    fetchSpots();
  }, []);

  const testimonials = [
    { name: "מיכל כהן", role: "בת לניצול שואה", text: "זה שינה לנו את הבוקר. במקום להתקשר בלחץ, אני מקבלת הודעה כשהיא שותה את הקפה.", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face" },
    { name: "דני לוי", role: "בן להורה יחיד", text: "סוף סוף אבא מרגיש שאני לא מעיק עליו, ואני רגוע שהוא התעורר והכל בסדר.", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face" },
    { name: "רחל אברהם", role: "סבתא ל-12", text: "הכפתור הירוק כל כך פשוט. אני לוחצת וכל הילדים שלי יודעים מיד שאני בסדר.", img: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=80&h=80&fit=crop&crop=face" },
    { name: "יוסי מזרחי", role: "מנהל הייטק", text: "השירות הזה נותן לי שקט נפשי באמצע יום עבודה עמוס. פשוט ויעיל.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face" },
    { name: "אורית גל", role: "בת להורים בקיבוץ", text: "זה פשוט נותן לנו להתחיל את היום בידיעה שהכל בסדר, בלי להפריע לשגרה שלהם.", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face" },
    { name: "שמואל כץ", role: "גמלאי", text: "אני מרגיש בטוח יותר בידיעה שהמשפחה שלי מחוברת אליי בלחיצת כפתור.", img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=80&h=80&fit=crop&crop=face" }
  ];

  const handleExistingUserLogin = async () => {
    const email = prompt("אנא הזן את האימייל איתו נרשמת למערכת:");
    if (!email || !email.includes('@')) { if (email) alert("נא להזין כתובת מייל תקינה"); return; }
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.from('contacts').select('customer_email').eq('customer_email', cleanEmail).limit(1);
      if (error) throw error;
      if (data && data.length > 0) { localStorage.setItem('senior_user_email', cleanEmail); router.push('/admin'); }
      else { alert("המייל אינו רשום במערכת."); }
    } catch (err) { alert("שגיאה בחיבור."); }
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-right text-slate-900" dir="rtl" suppressHydrationWarning>

      {/* Navbar */}
      <nav className="p-4 md:p-6 max-w-6xl mx-auto flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none">SeniorSafe</h1>
          <p className="text-[8px] md:text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mr-[-0.2em] mt-1">
            גשר דיגיטלי למשפחה
          </p>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <Link href="/about" className="text-slate-500 font-bold hover:text-blue-600 transition text-xs md:text-sm whitespace-nowrap">הסיפור שלנו</Link>
          <button
            onClick={handleExistingUserLogin}
            className="bg-slate-100 px-3 py-2 rounded-lg text-slate-700 font-bold hover:bg-blue-600 hover:text-white transition text-[11px] md:text-sm whitespace-nowrap"
          >
            {loading ? 'בודק...' : 'ניהול מלווים'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-8 md:py-16 px-6 max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-12 items-center">

        {/* Mockup */}
        <div className="order-1 md:order-2 relative justify-self-center">
          <div className="relative mx-auto w-56 h-112.5 md:w-70 md:h-145 bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border-8 md:border-12 border-slate-900 shadow-2xl overflow-hidden ring-8 ring-slate-100/50 transform rotate-1 md:rotate-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-6 md:w-8 h-1 bg-slate-800 rounded-full"></div>
            </div>
            <div className="relative w-full h-full bg-white overflow-hidden">
              <img src="/app-screenshot.png" alt="SeniorSafe App" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        {/* Text Section */}
        <div className="order-2 md:order-1 text-center md:text-right">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-[10px] font-bold italic">
              👩‍⚕️ פותח על ידי מרפאה בעיסוק
            </span>
            <span className="bg-green-50 text-green-800 px-3 py-1 rounded-lg text-[10px] font-bold">
              🇮🇱 מיוצר ומאוחסן בישראל
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-bold">
              🔒 אבטחה מלאה
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-slate-800 tracking-tight">
            הדרך המכבדת לשמור <br/>
            על <span className={`text-blue-600 ${caveat.className} text-4xl md:text-6xl inline-block`} style={{ transform: 'rotate(-2deg)' }}>העצמאות של ההורים המתבגרים.</span>
          </h1>

          <div className="bg-blue-50/50 border-r-4 border-blue-600 p-6 mb-8 text-right shadow-sm rounded-l-2xl">
            <p className="text-slate-800 font-bold mb-4 text-sm md:text-base leading-relaxed">
              נעים מאוד, אני מרפאה בעיסוק, עובדת עם הדור השלישי ובת להורים מתבגרים. במשך שנים ראיתי את המורכבות הזו מהצד המקצועי...
            </p>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4 italic">
              "הסיפור האישי שלי התחיל בכל בוקר מחדש, כשהלב שלי היה מחסיר פעימה: האם להתקשר עכשיו? אולי הם עוד ישנים? אולי קרה משהו והם לא יכולים לענות?"
            </p>
            <p className="text-slate-800 font-medium text-sm md:text-base leading-relaxed mb-6">
              מצאתי את עצמי במלכודת – מצד אחד דאגה עמוקה, ומצד שני חוסר נעימות להפוך כל שיחה ל"בדיקת נוכחות" מעיקה. הבנתי שחסר לנו <span className="text-blue-700 font-black">גשר דיגיטלי חם ומכבד.</span>
            </p>
          </div>

          <button
            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl hover:scale-105 active:scale-95"
          >
            אני רוצה להצטרף למייסדים
          </button>
        </div>
      </header>

      {/* פירוט השירותים */}
      <section className="py-16 bg-white px-6 border-y border-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center text-slate-800 tracking-tight">הרבה יותר מסתם כפתור</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">📞</div>
              <h3 className="text-xl font-black mb-3 text-blue-600">קשר מהיר עבור ההורה</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                ההורה יכול להתקשר אלייך (המכותב הראשי) או לכל אחד מהמלווים בלחיצה אחת מהירה מתוך המערכת, בלי להסתבך עם חיפוש אנשי קשר ברגע של צורך.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">💬</div>
              <h3 className="text-xl font-black mb-3 text-blue-600">עדכון אוטומטי למשפחה</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                ברגע שההורה לוחץ על הכפתור, נשלחת הודעת וואטסאפ מרגיעה לכל רשימת המלווים שהגדרתם מראש. כולם מעודכנים בבת אחת.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl hover:shadow-2xl transition group transform md:-translate-y-2">
              <div className="text-4xl mb-4 group-hover:rotate-12 transition">🔔</div>
              <h3 className="text-xl font-black mb-3">מנגנון התראה אקטיבי</h3>
              <p className="text-blue-50 leading-relaxed font-medium">
                <span className="font-black underline">זה הפלא האמיתי:</span> אם ההורה לא לחץ על הפעמון שעתיים אחרי המועד שקבעתם – המערכת שולחת לכם התראה אוטומטית:
                <span className="block mt-2 font-black italic">"כדאי שתבדקו, אמא לא עדכנה היום."</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 bg-blue-600 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-white font-black text-xl md:text-2xl mb-2">
            מוכנים לשקט נפשי אמיתי?
          </p>
          <p className="text-blue-100 text-sm mb-6 font-medium">
            הצטרפו למשפחות שכבר נרגעו — שנה שלמה ב-199 ₪
          </p>
          <button
            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition shadow-xl hover:scale-105 active:scale-95"
          >
            אני רוצה להצטרף ←
          </button>
        </div>
      </section>

      {/* 4 שלבים */}
      <section id="steps" className="py-16 bg-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12 italic">איך זה עובד ב-4 שלבים?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "נרשמים", desc: "בוחרים עד 5 בני משפחה שיקבלו את העדכונים." },
              { num: "02", title: "הלחיצה", desc: "ההורה לוחץ על הכפתור הירוק בבוקר מהנייד." },
              { num: "03", title: "שקט", desc: "כל המשפחה מקבלת הודעה אוטומטית שהכל בסדר." },
              { num: "04", title: "ביטחון", desc: "התראה מיידית אם לא בוצע עדכון בזמן שנקבע." }
            ].map((step, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl shadow-sm text-center border border-slate-200">
                <div className="text-blue-500 font-black text-3xl mb-3">{step.num}</div>
                <h3 className="font-black text-base mb-2 text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* טסטמוניאלס */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-12 text-slate-800 italic underline decoration-blue-500 underline-offset-8">מה המשפחות שלנו אומרות</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm italic text-right">
                <div className="flex justify-end mb-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                </div>
                <div className="text-yellow-400 text-xs mb-2">★★★★★</div>
                <p className="text-slate-600 mb-4 text-xs md:text-sm font-medium leading-relaxed">"{t.text}"</p>
                <div className="font-black text-slate-800 text-xs">{t.name}</div>
                <div className="text-blue-600 text-[10px] font-bold">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* תשלום */}
      <section id="offer" className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-b-12 border-blue-600">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-full font-black absolute top-2 left-1/2 transform -translate-x-1/2 text-[10px] uppercase tracking-widest italic">
            {spotsLeft === null ? 'טוען...' : `נשארו ${spotsLeft} מקומות למייסדים`}
          </div>

          <div className="mt-6">
            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">חבילת SeniorSafe Family</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right max-w-xl mx-auto mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-slate-200 text-sm">✅ הודעות וואטסאפ לכל המלווים</div>
              <div className="flex items-center gap-2 text-slate-200 text-sm">✅ בחירת שעה מותאמת אישית</div>
              <div className="flex items-center gap-2 text-slate-200 text-sm">✅ לחצן חיוג מהיר להורה</div>
              <div className="flex items-center gap-2 text-slate-200 text-sm">✅ ניהול מלווים ללא הגבלה</div>
            </div>

            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-slate-500 line-through text-xl font-bold">₪49 לחודש</span>
              <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">₪199</span>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-2xl font-black text-blue-400 italic underline decoration-2 underline-offset-8">
                שנת שקט נפשי מלא ב-199 ₪ בלבד
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 max-w-sm mx-auto">
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  במחיר של <span className="text-blue-400 font-bold">כוס קפה אחת בחודש (17 ₪)</span>,
                  אתם מבטיחים שההורה תמיד מוגן ומחובר אליכם.
                </p>
              </div>
            </div>

            {/* ACTION AREA */}
            <div className="max-w-xs mx-auto space-y-6">
              {!paid ? (
                <div className="flex flex-col gap-6">

                  {/* COUPON FIELD */}
                  <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">יש לך קוד הנחה?</label>
                    <input
                      type="text"
                      placeholder="הזן קוד כאן"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-center text-white focus:border-blue-500 outline-none transition-all uppercase text-sm"
                      value={coupon}
                      onChange={async (e) => {
                        const val = e.target.value.toUpperCase();
                        setCoupon(val);
                        if (val === 'FREE-FAMILY20') {
                          const email = prompt("אנא הזיני את המייל שלך כדי שנוכל לזהות אותך:");
                          if (!email || !email.includes('@')) {
                            alert("נא להזין כתובת מייל תקינה");
                            setCoupon('');
                            return;
                          }
                          const cleanEmail = email.trim().toLowerCase();
                          await supabase.from('customers').upsert({
                            email: cleanEmail,
                            payment_status: 'coupon',
                            plan_type: 'lifetime'
                          });
                          localStorage.setItem('senior_user_email', cleanEmail);
                          setPaid(true);
                          setTimeout(() => { router.push("/admin"); }, 1500);
                        }
                      }}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
                    <div className="relative flex justify-center text-[9px] uppercase"><span className="bg-slate-900 px-3 text-slate-600 font-black italic">אפשרויות תשלום</span></div>
                  </div>

                  {/* PAYPAL */}
                  <div className="bg-white p-4 rounded-2xl shadow-inner min-h-40 flex items-center justify-center overflow-hidden">
                    <PayPalButton
                      amount="199.00"
                      onSuccess={() => {
                        setPaid(true);
                        setTimeout(() => { router.push("/admin"); }, 2000);
                      }}
                    />
                  </div>

                  {/* וואטסאפ */}
                  <div className="text-center">
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3 font-bold">או</p>
                    <a
                      href="https://wa.me/972546060011?text=היי%2C%20אני%20רוצה%20להצטרף%20ל-SeniorSafe%20ולשלם%20199%20%E2%82%AA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-base hover:bg-green-600 transition shadow-lg"
                    >
                      <span>💬</span>
                      <span>תשלום ידני דרך וואטסאפ</span>
                    </a>
                    <p className="text-slate-400 text-[10px] mt-2 font-medium">נחזור אליך תוך מספר דקות</p>
                  </div>

                </div>
              ) : (
                <div className="bg-green-500/20 text-green-400 p-8 rounded-3xl font-black border border-green-500/30 animate-pulse text-lg">
                  🎉 התשלום התקבל בהצלחה! <br/>
                  <span className="text-sm font-medium">מעביר אותך לדף הניהול...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* שאלות ותשובות */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-black text-center mb-12 text-slate-900">שאלות נפוצות</h2>
        <div className="max-w-2xl mx-auto space-y-4 text-right" dir="rtl">
          {[
            {
              q: "איך מוסיפים את SeniorSafe כ\"אייקון\" על מסך הבית?",
              a: "פתחו את האתר בטלפון. באייפון: לחצו על כפתור ה-\"שתף\" (מרובע עם חץ למעלה) ובחרו \"הוסף למסך הבית\". באנדרואיד: לחצו על שלוש הנקודות בדפדפן ובחרו \"התקן אפליקציה\" או \"הוסף למסך הבית\"."
            },
            {
              q: "איך אני מוצא/ת קישור (URL) לתמונה?",
              a: "העלו את התמונה הרצויה לוואטסאפ במחשב (WhatsApp Web), קליק ימני על התמונה ובחרו \"העתק כתובת תמונה\". הדביקו את הקישור שקיבלתם בהגדרות המלווה במערכת."
            },
            {
              q: "מהו פורמט מספר הטלפון המדויק?",
              a: "יש להזין פורמט בינלאומי ללא סימנים כלל. לדוגמה: 972541234567 (שימו לב: ללא ה-0 בהתחלה וללא סימן ה-+)."
            },
            {
              q: "מה קורה אם ההורה שוכח ללחוץ?",
              a: "המערכת תמתין עד לשעה המדויקת שהגדרתם. במידה ולא התקבל עדכון מההורה עד לאותה שעה, תשלח הודעת וואטסאפ אוטומטית לכל המלווים שרשמתם במערכת."
            },
            {
              q: "מה קורה בתום השנה? האם תהיה לי גישה לנתונים?",
              a: "נשלח לכם תזכורת ידידותית חודש לפני תום המנוי כדי שתוכלו לחדש אותו בקלות. לא ביצענו חיוב אוטומטי, כך שאתם תמיד בשליטה מלאה."
            },
            {
              q: "האם המחיר של 199 ₪ יישאר לי גם בשנה הבאה?",
              a: "כן! כחלק מנבחרת המייסדים (Founders), אנחנו מתחייבים שהמחיר המיוחד שלכם יישמר גם בחידושים הבאים."
            },
            {
              q: "199 ₪ לשנה? זה הכל?",
              a: "בדיוק. פחות מ-17 ₪ לחודש – שזה פחות ממחיר של כוס קפה אחת. אנחנו מאמינים שביטחון ושקט נפשי למשפחה צריכים להיות נגישים לכל אחד."
            }
          ].map((faq, index) => (
            <details key={index} className="group border border-slate-200 rounded-2xl p-4 bg-slate-50 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:bg-white hover:shadow-md">
              <summary className="flex justify-between items-center font-black text-lg text-slate-900">
                <span className="ml-4">{faq.q}</span>
                <span className="text-blue-600 transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-slate-900 font-medium leading-relaxed border-t border-slate-200 pt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-[10px] font-bold italic">
        <div className="flex justify-center gap-6 mb-4 text-slate-600 underline text-xs">
          <Link href="/terms">תנאי שימוש</Link>
          <Link href="/privacy">פרטיות</Link>
          <Link href="/support" className="text-blue-600">מרכז תמיכה</Link>
        </div>
        <p className="opacity-60 italic">© 2026 SeniorSafe • hello@communicateclever.com</p>
        <p className="mt-2 opacity-40 uppercase tracking-widest text-[8px]">Crafted for Families, by Caregivers</p>
      </footer>
    </div>
  );
}