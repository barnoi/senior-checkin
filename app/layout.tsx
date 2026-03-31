import type { Metadata } from "next";
import { Heebo } from "next/font/google"; // החלפה ל-Heebo
import "./globals.css";

// הגדרת הפונט החדש שתומך בעברית מושלמת
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "SeniorSafe | שקט נפשי למשפחה",
  description: "עדכון בוקר קל ונוח מההורים ישירות לווטסאפ של הילדים",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} ${heebo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}