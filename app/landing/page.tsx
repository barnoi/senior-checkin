'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PayPalButton from '../components/PayPalButton';

export default function LandingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [paid, setPaid] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-2xl font-black text-blue-600">SeniorSafe</div>
        <div className="flex gap-4">
          <Link href="/" className="bg-slate-100 text-slate-900 px-5 py-2 rounded-full font-bold hover:bg-slate-200 transition">כניסה</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-linear-to-b from-blue-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-bold mb-6 inline-block">🚀 הצעה מיוחדת: מנוי מייסדים לכל החיים (Pre-sale)</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            השקט הנפשי שלכם <br />
            <span className="text-blue-600">מתחיל כאן.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            במקום להתקשר בלחץ כל בוקר, קבלו הודעת ווטסאפ מרגיעה כשאבא או אמא מעדכנים שהכל בסדר. פשוט, מכבד ומרגיע.
          </p>
        </div>
      </header>

      {/* Pricing Section - האזור החדש עם פייפל */}
      <section id="pricing" className="py-20 px-6 bg-slate-900 text-white rounded-[3rem] mx-4 shadow-2xl overflow-hidden relative">
        <div className="max-w-md mx-auto text-center relative z-10">
          {!paid ? (
            <>
              {!showPayment ? (
                <div className="animate-in fade-in duration-700">
                  <div className="bg-yellow-400 text-slate-900 font-bold px-4 py-1 rounded-full text-sm inline-block mb-6 uppercase tracking-wider">
                    נשארו 50 יחידות אחרונות
                  </div>
                  <h2 className="text-3xl font-bold mb-2 italic">חבילת Founders</h2>
                  <div className="text-7xl font-black mb-2 text-yellow-400">₪99</div>
                  <div className="text-xl opacity-50 line-through mb-4 italic">במקום מנוי חודשי של ₪49</div>
                  <p className="text-lg font-bold mb-10 text-blue-300">תשלום חד-פעמי - גישה לכל החיים!</p>
                  
                  <ul className="text-right space-y-4 mb-10 text-lg">
                    <li className="flex items-center gap-3">✅ <span>עד 5 בני משפחה מקבלים עדכון בווטסאפ</span></li>
                    <li className="flex items-center gap-3">✅ <span>לוח ניהול אישי להוספת הורים ואנשי קשר</span></li>
                    <li className="flex items-center gap-3">✅ <span>כפתור חיוג מהיר לחירום מובנה</span></li>
                  </ul>

                  <button 
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-2xl font-black py-6 rounded-2xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                  >
                    אני רוצה להצטרף עכשיו
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl text-slate-900 shadow-inner animate-in slide-in-from-bottom duration-500">
                  <h3 className="text-2xl font-bold mb-2">השלמת רכישה</h3>
                  <p className="text-slate-500 mb-6 text-sm">התשלום מאובטח באמצעות PayPal</p>
                  
                  {/* קריאה לרכיב הפייפל שיצרנו */}
                  <PayPalButton 
                    amount="99.00" 
                    onSuccess={(details) => {
                      console.log("Success:", details);
                      setPaid(true);
                    }} 
                  />
                  
                  <button onClick={() => setShowPayment(false)} className="text-sm text-slate-400 mt-6 underline block w-full text-center hover:text-slate-600 transition">
                    חזרה למסלולים
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-10 animate-in zoom-in duration-500">
              <div className="text-7xl mb-6">⭐</div>
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">תודה רבה!</h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">ההרשמה למסלול המייסדים הושלמה בהצלחה. השקט הנפשי שלכם מתחיל עכשיו.</p>
              <Link href="/" className="inline-block bg-green-500 text-white px-12 py-4 rounded-full font-bold text-xl hover:bg-green-600 transition shadow-xl">
                כניסה למערכת
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-400 py-16 px-6 text-center text-sm">
        <div className="flex justify-center gap-8 mb-8 font-bold text-slate-600">
          <Link href="/terms" className="hover:text-blue-600 transition">תנאי שימוש</Link>
          <Link href="/privacy" className="hover:text-blue-600 transition">פרטיות</Link>
          <Link href="/support" className="hover:text-blue-600 transition">תמיכה</Link>
        </div>
        <p className="tracking-widest opacity-50 uppercase">SeniorSafe © 2026. PROTECTING WHAT MATTERS.</p>
      </footer>
    </div>
  );
}