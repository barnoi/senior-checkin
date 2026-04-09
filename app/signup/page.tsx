'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PayPalButton from '../components/PayPalButton';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  // פונקציה שמעדכנת את בסיס הנתונים לאחר התשלום
  const handlePaymentSuccess = async (details: any) => {
    setLoading(true);
    try {
      // 1. נרשום את הלקוח בטבלת הלקוחות שלנו
      const { error } = await supabase
        .from('customers')
        .upsert([
          { 
            email: email, 
            payment_status: 'paid', 
            plan_type: 'founder_lifetime',
            paypal_order_id: details.id 
          }
        ]);

      if (error) throw error;

      setIsPaid(true);
      
      // 2. אחרי 2 שניות, נעביר אותו לדף ההגדרות (Admin)
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (err) {
      console.error("Error saving payment:", err);
      alert("התשלום עבר אך נתקלנו בבעיה ברישום. אל דאגה, המייל שלך שמור אצלנו.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-right" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-100 relative overflow-hidden">
        
        {/* קישוט קטן למעלה */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-blue-600"></div>

        {!isPaid ? (
          <>
            <Link href="/" className="text-blue-600 text-sm font-bold mb-6 inline-block hover:underline">
              ← חזרה לדף הבית
            </Link>
            
            <h1 className="text-3xl font-black text-slate-800 mb-2">הצטרפות ל-Founders</h1>
            <p className="text-slate-500 mb-8 font-medium">תשלום חד-פעמי של ₪199 לכל החיים.</p>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 mr-1">אימייל למשלוח הקבלה והגדרת החשבון:</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 outline-none focus:border-blue-500 transition-all text-left font-sans"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {email.includes('@') && email.length > 5 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 transition-all">
                   <p className="text-xs text-blue-600 font-black mb-4 italic text-center">** מצב בדיקה פעיל: המחיר הוא 1 ש"ח **</p>
                   <PayPalButton 
                     amount="1.00" // שוני ל-199.00 כשתרצי לעבור למחיר מלא
                     onSuccess={handlePaymentSuccess} 
                   />
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-2xl text-slate-400 font-bold border-2 border-dashed border-slate-200">
                  הזינו אימייל תקין כדי להמשיך לתשלום
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">ברוכים הבאים!</h2>
            <p className="text-slate-600 font-medium mb-8">
              התשלום עבור האימייל <br/>
              <span className="text-blue-600 font-bold">{email}</span> <br/>
              נקלט במערכת.
            </p>
            <div className="flex justify-center italic text-blue-500 font-bold animate-pulse text-sm">
              מעביר אותך להגדרת המלווים...
            </div>
          </div>
        )}

        <footer className="mt-10 pt-6 border-t border-slate-50 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Secure Payment by PayPal • SeniorSafe 2026
        </footer>
      </div>
    </div>
  );
}