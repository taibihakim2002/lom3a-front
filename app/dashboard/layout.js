'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// --- (تمت إضافة Tooltip) ---
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  ClipboardList,
  GalleryHorizontal,
  Star,
  Menu,
  User,
  LogOut,
  Bell,
  ExternalLink // --- التعديل هنا: تمت إضافة أيقونة ---
} from 'lucide-react';
import { usePathname } from 'next/navigation';
// ================================
//  محتوى التنقل (مشترك)
// ================================
const navLinks = [
  { name: "الرئيسية", href: "/admin", icon: <Home size={20} /> },
  { name: "طلبات الحجز", href: "/admin/bookings", icon: <ClipboardList size={20} /> },
  { name: "إدارة المعرض", href: "/admin/gallery", icon: <GalleryHorizontal size={20} /> },
  { name: "آراء العملاء", href: "/admin/testimonials", icon: <Star size={20} /> },
];
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// ================================
// (مكون الشريط الجانبي الداخلي للتبسيط)
// ================================
// ================================
//  محتوى التنقل (مشترك)
// ================================
function SidebarContent({ onLinkClick = () => {} }) {
  
  // --- التعديل هنا: استخدام hook لمعرفة الرابط النشط ---
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full text-right">
      {/* الشعار */}
      <div className="p-4 pb-6 flex items-center justify-center gap-2 border-b border-border">
        <span className="text-xl font-bold text-foreground">لمعة البيت</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
          ل
        </div>
      </div>
      
      {/* --- التعديل هنا: تصميم "Pill" الجديد للروابط --- */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' // (التصميم النشط)
                  : 'text-muted-foreground hover:bg-accent hover:text-primary' // (التصميم العادي)
                }
              `}
            >
                <div className={`p-1 rounded-md ${isActive ? 'bg-primary-foreground/10' : ''}`}>
                {link.icon}
              </div>
              {link.name}
              {/* (الأيقونة تبقى ظاهرة دائماً) */}
              
            </Link>
          );
        })}
      </div>
      {/* --- نهاية التعديل --- */}

      {/* --- التعديل هنا: تنظيم الروابط السفلية --- */}
      <div className="mt-auto p-3 border-t border-border space-y-1">
        
        {/* تسجيل الخروج */}
        <Button 
          variant="ghost" 
          className="w-full justify-center gap-3 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          تسجيل الخروج
          <LogOut size={20} />
        </Button>
      </div>
      {/* --- نهاية التعديل --- */}
    </nav>
  );
}


// ================================
// 🏗️ Admin Layout (تصميم "هجين" جديد)
// ================================
export default function AdminLayout({ children }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary">
      
      {/* --- 1. الشريط الجانبي (للحاسوب فقط - ثابت) --- */}
      <aside className="hidden md:flex h-full w-20 flex-col items-center fixed right-0 top-0 z-30 border-l bg-background shadow-lg">
        {/* الشعار */}
        <div className="flex h-16 items-center justify-center border-b px-2">
          <Link href="/admin" className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-10 w-10 font-bold text-lg">
            ل
          </Link>
        </div>
        
        {/* روابط الأيقونات مع Tooltip */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-1 flex-col items-center gap-2 py-4">
            {navLinks.map((link) => (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild 
                    className="text-muted-foreground hover:text-primary hover:bg-accent h-12 w-12"
                  >
                    <Link href={link.href}>{link.icon}</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={5}>
                  <p>{link.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>

        {/* قائمة المستخدم (أسفل الشريط) */}
        <div className="mt-auto flex flex-col items-center gap-4 p-4 border-t">
          <DropdownMenu dir="rtl">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={5}>
                  <p>حسابي</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" side="left" sideOffset={10} className="w-48">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/settings" className="w-full text-right">الإعدادات</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* --- 2. الهيدر العلوي (للموبايل) و (المحتوى الرئيسي) --- */}
      <div className="flex flex-col md:mr-20">
        
        {/* --- الهيدر العلوي (يظهر دائماً الآن) --- */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          
          {/* --- قائمة الموبايل (Sheet) --- */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              {/* (يختفي على الحاسوب) */}
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 bg-background">
                <VisuallyHidden>
              <SheetHeader>
                <SheetTitle>Menu </SheetTitle>
                <SheetDescription> Menu
          </SheetDescription>
        </SheetHeader>
        </VisuallyHidden>
              <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* (الشعار - يظهر للموبايل فقط) */}
          <Link href="/admin" className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base">
              ل
            </div>
            <span className="text-lg font-bold text-foreground">
              لوحة التحكم
            </span>
          </Link>

          {/* --- التعديل هنا: استبدال الـ div برابط العودة --- */}
          <div className="hidden md:block">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/">
                <ExternalLink size={16} />
                العودة إلى الموقع
              </Link>
            </Button>
          </div>
          {/* --- نهاية التعديل --- */}

          {/* --- قائمة المستخدم (تظهر دائماً في اليسار) --- */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="sr-only">التنبيهات</span>
            </Button>

            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">فتح قائمة المستخدم</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/admin/settings" className="w-full text-right">الإعدادات</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </header>

        {/* --- 3. المحتوى الرئيسي (Children) --- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}