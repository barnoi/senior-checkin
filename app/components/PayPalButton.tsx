'use client';
import React, { useEffect, useRef } from 'react';

interface PayPalProps {
  amount: string;
  onSuccess: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderButtons = () => {
      // @ts-ignore
      if (window.paypal && window.paypal.Buttons && containerRef.current) {
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
                description: "SeniorSafe - Founders Lifetime Access",
                amount: {
                  currency_code: "ILS",
                  value: amount
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture();
            
            // אנחנו לא דורסים כאן את ה-localStorage.
            // אנחנו נותנים לפונקציית ה-onSuccess של דף ה-Signup לטפל ברישום.
            onSuccess(details);
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
            alert("הייתה שגיאה בתשלום, אנא נסו שנית.");
          }
        }).render(containerRef.current);
      }
    };

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.error("PayPal Client ID is missing!");
      return;
    }

    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS`;
      script.async = true;
      script.onload = renderButtons;
      document.body.appendChild(script);
    } else {
      renderButtons();
    }
    // הוספת מנגנון ניקוי במידה והקומפוננטה יוצאת מהמסך
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [amount, onSuccess]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="min-h-37.5"></div>
    </div>
  );
}