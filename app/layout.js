import { Tajawal, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider } from "./contexts/ProfileProvider";

// إعداد خط تجول للنصوص الأساسية
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

// إعداد خط Poppins للعناوين (اختياري ولكن موصى به)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "اسم المصور | مصور فوتوغرافي محترف",
  description: "معرض أعمال وخدمات التصوير الاحترافي للمناسبات والمنتجات.",
};

export default function RootLayout({ children }) {
  return (
    // تطبيق الوضع الداكن والاتجاه واللغة
    <html lang="ar" dir="rtl" className="dark">
      {/* دمج متغيرات الخطوط وتطبيق الخط الأساسي */}
      <body className={`${tajawal.variable} ${poppins.variable} font-sans antialiased`}>
        <ProfileProvider>
        {children}
        <Toaster 
          richColors 
          closeButton 
          style={{ zIndex: 9999 }}
        />
        </ProfileProvider>
      </body>
    </html>
  );
}
