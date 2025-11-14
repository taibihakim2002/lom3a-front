'use client';
import Link from 'next/link';

import { 
  Phone, Mail, MapPin,
  Clock,
  Facebook,
  Instagram,
} from 'lucide-react'; 

export default function Footer() {
  
  const quickLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'من نحن', href: '/about' },
    { name: 'الخدمات', href: '/services' },
    { name: 'معرض الأعمال', href: '/gallery' },
    { name: 'احجز الآن', href: '/booking' },
  ];

  const contactInfo = [
    { 
      icon: <Phone size={16} className="text-blue-400" />, 
      text: "+962 79 555 1234",
      href: "tel:+962795551234"
    },
    { 
      icon: <Mail size={16} className="text-blue-400" />, 
      text: "info@lammat-albayt.jo",
      href: "mailto:info@lammat-albayt.jo"
    },
    { 
      icon: <MapPin size={16} className="text-blue-400" />, 
      text: "عمّان، الأردن",
      href: "#" // (يمكن وضع رابط خرائط جوجل هنا)
    },
    { 
      icon: <Clock size={16} className="text-blue-400" />, 
      text: "9:00 صباحًا – 7:00 مساءً",
      href: "#"
    },
  ];

  return (
    <footer className="bg-foreground text-gray-300">
      {/* (فاصل بسيط عن قسم الحجز) */}
      <div className="border-t border-gray-700/50">
        <div className="container mx-auto px-4 md:px-6 py-16">
          
          {/* --- شبكة الفوتر --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">

            {/* --- العمود 1: عن الشركة --- */}
            <div className="space-y-4">
              {/* الشعار */}
              <Link href="/" className="flex items-center justify-start gap-2 mb-4">
                <span className="text-2xl font-bold text-background">لمعة البيت</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background font-bold text-lg">
                  ل
                </div>
              </Link>
              <p className="text-sm max-w-xs leading-relaxed">
                شركة أردنية صغيرة متخصصة في تقديم خدمات تنظيف المنازل والمكاتب مع الحرص على الجودة وخدمة العملاء الممتازة.
              </p>
              {/* أيقونات التواصل الاجتماعي */}
              <div className="flex gap-4 justify-end pt-2">
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Instagram size={20} />
                </Link>
              
              </div>
            </div>

            {/* --- العمود 2: روابط سريعة --- */}
            <div className="md:mx-auto">
              <h4 className="text-lg font-bold text-background mb-4">روابط سريعة</h4>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- العمود 3: معلومات الاتصال --- */}
            <div className="md:mx-auto">
              <h4 className="text-lg font-bold text-background mb-4">معلومات الاتصال</h4>
              <ul className="space-y-4 text-sm">
                {contactInfo.map(item => (
                  <li key={item.text} className="flex items-center justify-end gap-3">
                    <a href={item.href} className="hover:text-blue-400 transition-colors">
                      {item.text}
                    </a>
                    {item.icon}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* --- العمود 4: الخريطة --- */}
            <div>
              <h4 className="text-lg font-bold text-background mb-4">موقعنا</h4>
              {/* (هذه خريطة وهمية، يمكن استبدالها بـ iframe من خرائط جوجل) */}
              <div className="h-48 w-full rounded-lg overflow-hidden relative border border-gray-700">
                <img 
                  src="https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="خريطة موقع الشركة" 
                  className="w-full h-full object-cover grayscale opacity-30"
                />
                <div className="absolute inset-0 bg-blue-900/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                bg-primary p-3 rounded-full shadow-lg">
                  <MapPin size={32} className="text-background" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* --- شريط الحقوق السفلي --- */}
      <div className="border-t border-gray-700/50 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} لمعة البيت. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
