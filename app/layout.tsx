import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "SeniorSafe | שקט נפשי למשפחה",
  description: "עדכון בוקר קל ונוח מההורים ישירות לוואטסאפ של הילדים",
  manifest: "/manifest.json",
  // כאן הוספנו את ההגדרות לתצוגה המקדימה (וואטסאפ, פייסבוק וכו')
  openGraph: {
    title: "SeniorSafe | שקט נפשי למשפחה",
    description: "עדכון בוקר קל ונוח מההורים ישירות לוואטסאפ של הילדים",
    url: "https://senior.communicateclever.com/landing",
    siteName: "SeniorSafe",
    images: [
      {
        url: "https://senior.communicateclever.com/app-screenshot.png", // שינוי לנתיב מלא
        width: 1200,
        height: 630,
        alt: "SeniorSafe App Preview",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  // הגדרות אופציונליות לטוויטר
  twitter: {
    card: "summary_large_image",
    title: "SeniorSafe | שקט נפשי למשפחה",
    description: "עדכון בוקר קל ונוח מההורים ישירות לוואטסאפ של הילדים",
    images: ["/app-screenshot.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body 
        className={`${heebo.variable} ${heebo.className} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}