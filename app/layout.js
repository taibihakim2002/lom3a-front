import { Almarai, Poppins } from "next/font/google"; // تم استبدال Noto_Sans_Arabic بـ Almarai
import "./globals.css";

import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

// ================================
// 📝 إعداد الخطوط (Google Fonts)
// ================================

// (تم تغيير الخط الأساسي إلى Almarai)
const fontSans = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"], // (Almarai يدعم أوزان أقل، 400 و 700 كافية)
  variable: "--font-sans-arabic", // اسم المتغير بقي كما هو
});

const fontDisplay = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-latin",
});

// ================================
// 🌍 Metadata الأساسي للمشروع
// ================================
export const metadata = {
  title: "لمعة البيت | لخدمات تنظيف المنازل والمكاتب",
  description: "شركة أردنية رائدة متخصصة في تقديم خدمات تنظيف المنازل والمكاتب في عمّان.",
};

// ================================
// 🏗️ Root Layout Starter
// ================================
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      {/* تم تحديث المتغيرات هنا */}
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}