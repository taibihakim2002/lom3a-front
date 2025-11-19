'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { authApi } from '@/features/auth/api'; 
// --- (1) استيراد مكون الإشعارات الجديد ---
import NotificationsMenu from '@/features/notifications/components/NotificationsMenu';
// ---------------------------------------

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
  ExternalLink,
  Loader2 
} from 'lucide-react';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navLinks = [
  { name: "الرئيسية", href: "/admin/dashboard", icon: <Home size={20} /> },
  { name: "طلبات الحجز", href: "/admin/dashboard/bookings", icon: <ClipboardList size={20} /> },
  { name: "إدارة المعرض", href: "/admin/dashboard/gallery", icon: <GalleryHorizontal size={20} /> },
  { name: "آراء العملاء", href: "/admin/dashboard/testimonials", icon: <Star size={20} /> },
];

function SidebarContent({ onLinkClick = () => {}, pathname, onLogoutClick, isLoggingOut }) { 
  return (
    <nav className="flex flex-col h-full text-right">
      {/* الشعار */}
      <div className="p-4 pb-6 flex items-center justify-center gap-2 border-b border-border">
        <span className="text-xl font-bold text-foreground">لمعة البيت</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
          ل
        </div>
      </div>
      
      <div className="flex-1 py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = link.href === "/admin/dashboard" 
            ? pathname === link.href 
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-primary'
                }
              `}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-primary-foreground/10' : ''}`}>
                {link.icon}
              </div>
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t border-border space-y-1">
        
        <Button 
          variant="ghost" 
          asChild 
          className="w-full justify-end gap-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
        >
          <Link href="/" onClick={onLinkClick}>
            العودة للموقع
            <ExternalLink size={20} />
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-end gap-3 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogoutClick}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "جارِ الخروج..." : "تسجيل الخروج"}
          {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
        </Button>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();
  
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.success("تم تسجيل الخروج بنجاح.");
      clearUser(); 
      router.push('/admin/login'); 
    },
    onError: (error) => {
      toast.error("فشل تسجيل الخروج، يرجى المحاولة مرة أخرى.");
    }
  });

  // 1. التحقق من الهوية
  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ['myProfile'],
    queryFn: authApi.getMyProfile,
    retry: 1, 
    refetchOnWindowFocus: false,
    staleTime: 0, 
  });

  const handleLogout = () => {
    logout();
  };
  
  useEffect(() => {
    if (!isLoading && isError) {
      router.replace('/admin/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading || isError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isSuccess) {
    return (
    <div className="flex min-h-screen w-full flex-col bg-secondary">
      <Toaster richColors position="top-right" /> 

      <aside className="hidden md:flex h-full w-20 flex-col items-center fixed right-0 top-0 z-30 border-l bg-background shadow-lg">
        <div className="flex h-16 items-center justify-center border-b px-2">
          <Link href="/admin/dashboard" className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-10 w-10 font-bold text-lg">
            ل
          </Link>
        </div>
        
        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-1 flex-col items-center gap-2 py-4">
            {navLinks.map((link) => {
              const isActive = link.href === "/admin/dashboard" 
                ? pathname === link.href 
                : pathname.startsWith(link.href);
                
              return (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      asChild 
                      className={`h-12 w-12 transition-colors
                        ${isActive
                          ? 'bg-accent text-primary' 
                          : 'text-muted-foreground hover:text-primary hover:bg-accent'
                        }
                      `}
                    >
                      <Link href={link.href}>{link.icon}</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={5}>
                    <p>{link.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>

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
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <LogOut className="ml-2 h-4 w-4" />}
                {isLoggingOut ? "جارِ الخروج..." : "تسجيل الخروج"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-col md:mr-20">
        
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 bg-background">
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Menu </SheetTitle>
                  <SheetDescription> Menu</SheetDescription>
                </SheetHeader>
              </VisuallyHidden>
              <SidebarContent 
                onLinkClick={() => setIsSheetOpen(false)} 
                pathname={pathname}
                onLogoutClick={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </SheetContent>
          </Sheet>

          <Link href="/admin/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base">
              ل
            </div>
            <span className="text-lg font-bold text-foreground">
              لوحة التحكم
            </span>
          </Link>

          <div className="hidden md:block">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/">
                <ExternalLink size={16} />
                العودة إلى الموقع
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            
             {/* --- التعديل هنا: استبدال زر الجرس بالمكون الجديد --- */}
             <NotificationsMenu /> 
             {/* ----------------------------------------------- */}

            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">فتح قائمة المستخدم</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <LogOut className="ml-2 h-4 w-4" />}
                  {isLoggingOut ? "جارِ الخروج..." : "تسجيل الخروج"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );}
  
  // احتياطياً
  return null;
}