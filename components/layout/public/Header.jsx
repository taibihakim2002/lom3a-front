'use client';

// (تم حذف "Swiper" وإضافة "useState" و "AnimatePresence")
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// *** تمت الإضافة: أيقونات جديدة للأقسام الجديدة ***
import { 
  Phone, Mail, MapPin, Menu} from 'lucide-react'; 
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const primaryNavLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الخدمات', href: '#services' },
    { name: 'معرض الاعمال', href: '#gallery' },
    { name: 'الحجز', href: '#booking' },
    { name: 'من نحن', href: '#about' },
  ];

  const cityLinks = [ 
    { name: 'عمان', href: '#' },
    { name: 'الزرقاء', href: '#' },
    { name: 'اربد', href: '#' },
    { name: 'السلط', href: '#' },
    { name: 'العقبة', href: '#' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      
      {/* --- الشريط العلوي (Top Bar) --- */}
      {/* --التعديل هنا-- (استخدام متغيرات الألوان) */}
      <div className="bg-foreground py-2 text-background">
        <div className="container mx-auto flex items-center justify-center md:justify-between px-4 text-sm md:px-6">
          
          <div className="hidden md:flex gap-4">
            {cityLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-xs hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            <a href="tel:+962795551234" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone size={14} />
              <span className="font-medium">+962 79 555 1234</span>
            </a>
            <a href="mailto:info@lammat-albayt.jo" className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail size={14} />
              <span>info@lammat-albayt.jo</span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5">
              <MapPin size={14} />
              <span>عمّان، الأردن</span>
            </div>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي للتنقل */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* --التعديل هنا-- (استخدام متغيرات الألوان) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
            ل
          </div>
          <span className="text-xl font-bold text-foreground">لمعة البيت</span>
        </Link>
        
        {/* روابط التنقل الرئيسية (للحاسوب) */}
        <nav className="hidden md:flex items-center gap-6">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              // --التعديل هنا-- (استخدام متغيرات الألوان)
              className={`text-base font-medium transition-colors ${
                link.href === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.name}
            </Link>))}
        </nav>

        {/* --التعديل هنا-- (تطبيق Sheet من shadcn/ui) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">فتح القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6">
            {/* رأس القائمة الجانبية (الشعار) */}
            <SheetHeader className="text-right mb-8">
              <SheetTitle></SheetTitle>
              <Link href="/" className="flex items-center justify-end gap-2" onClick={() => setIsSheetOpen(false)}>
                <span className="text-xl font-bold text-foreground">لمعة البيت</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  ل
                </div>
              </Link>
            </SheetHeader>
            
            {/* روابط التنقل (للموبايل) */}
            <nav className="flex flex-col space-y-4 text-right">
              {primaryNavLinks.map((link) => (
                <SheetClose asChild key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-lg font-medium transition-colors py-2 ${
                      link.href === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.name}
                  </Link>
                </SheetClose>
              ))}
              
              {/* زر الحجز (للموبايل) */}
              <SheetClose asChild>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-full mt-6">
                  <Link href="/booking">احجز الآن</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
        {/* -- نهاية التعديل -- */}

      </div>
    </header>
  );
}