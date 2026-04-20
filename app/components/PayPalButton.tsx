'use client';
import React, { useEffect, useRef } from 'react';

interface PayPalProps {
  amount: string;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. פונקציית הרינדור
    const renderButtons = () => {
      // @ts-ignore
      if (window.paypal && window.paypal.Buttons && containerRef.current) {
        // ניקוי ידני של תוכן המכולה כדי למנוע כפילויות לפני רינדור חדש
        containerRef.current.innerHTML = ''; 
        
        // @ts-ignore
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'rect',
            label:  'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: "SeniorSafe - Lifetime Access",
                amount: {
                  currency_code: "ILS",
                  value: amount
                }
              }]
            });
          },
         onApprove: async (data: any, actions: any) => {
  const details = await actions.order.capture();
  
  // 1. שמירת המייל של המשלם בזיכרון של הדפדפן
  const payerEmail = details.payer.email_address;
  localStorage.setItem('senior_user_email', payerEmail);
  
  // 2. קריאה לפונקציית ההצלחה הקיימת שלך
  onSuccess(details);

  // 3. ניתוב המשתמש לדף האדמין (ניהול המלווים)
  window.location.href = '/admin';
},
onError: (err: any) => {
  console.error("PayPal Error:", err);
  alert("הייתה שגיאה בתשלום, אנא נסו שנית.");
}
        }).render(containerRef.current);
      }
    };

    // 2. בדיקה וטעינת הסקריפט
    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=ILS`;
      script.async = true;
      script.onload = renderButtons;
      document.body.appendChild(script);
    } else {
      renderButtons();
    }
  }, [amount, onSuccess]);

  return (
    <div className="w-full">
      {/* שימוש ב-ref במקום ב-ID גלובלי מבטיח שליטה טובה יותר */}
      <div ref={containerRef} className="min-h-37.5"></div>
    </div>
  );
}