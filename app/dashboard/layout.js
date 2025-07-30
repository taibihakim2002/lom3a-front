"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    FolderKanban,
    User,
    CalendarCheck2,
    LogOut,
    Menu,
    Bell,
    ExternalLink,
    Loader2,
    Star,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";
import useAuthStore from "@/store/authStore";
import { FullScreenLoader } from "@/components/global/FullScreenLoader";
import { useProfile } from '../contexts/ProfileProvider';


// --- بيانات روابط الشريط الجانبي المحدثة ---
const sidebarNavLinks = [
    { title: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard /> },
    { title: "المشاريع", href: "/dashboard/projects", icon: <FolderKanban /> },
    { title: "الملف الشخصي", href: "/dashboard/profile", icon: <User /> },
    { title: "الحجوزات", href: "/dashboard/bookings", icon: <CalendarCheck2 /> },
    { title: "اراء العملاء", href: "/dashboard/testimonials", icon: <Star /> },
    { title: "الرسائل", href: "/dashboard/messages", icon: <Mail /> },
];

// --- مكون الشريط الجانبي ---
function Sidebar({ onLogout, isLoggingOut }) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen p-4 bg-card border-l border-border fixed right-0 top-0">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2 bg-primary rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-7 w-7 text-primary-foreground">
                        <rect width="256" height="256" fill="none"></rect>
                        <path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8V195.4a48,48,0,0,1,19-37.9l.8-.7a24,24,0,1,0-33.9-33.9l-.7.8a48,48,0,0,1-37.9,19H16a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H44.6a48,48,0,0,1,37.9-19l.7-.8a24,24,0,1,0,33.9,33.9l.8.7a48,48,0,0,1,19,37.9V88h28.6a48.4,48.4,0,0,1,43.8,32.3,8,8,0,0,1-14.8,6.9,32.4,32.4,0,0,0-29-21.2H168Z"></path>
                    </svg>
                </div>
                <h1 className="text-xl font-bold font-display">لوحة التحكم</h1>
            </div>
            <nav className="flex flex-col gap-1 flex-grow">
                {sidebarNavLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 text-base px-3 h-11",
                                pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <span className="w-5">{link.icon}</span>
                            {link.title}
                        </Button>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto">
                <Button onClick={onLogout} disabled={isLoggingOut} variant="ghost" className="w-full justify-start gap-3 text-base px-3 h-11 text-red-500/80 hover:text-red-500">
                    {isLoggingOut ? <Loader2 className="w-5 animate-spin" /> : <LogOut className="w-5" />}
                    {isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                </Button>
            </div>
        </aside>
    );
}

// --- مكون رأس الصفحة ---
function DashboardHeader({ onLogout, isLoggingOut }) {
    const { profile, isLoading } = useProfile();
    return (
        <header className="flex items-center justify-between h-20 px-4 sm:px-8 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                {/* زر القائمة للهواتف */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0">
                            <div className="flex flex-col h-full p-4 bg-card">
                                <div className="flex items-center gap-3 mb-8 px-2">
                                     <div className="p-2 bg-primary rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-7 w-7 text-primary-foreground"><rect width="256" height="256" fill="none"></rect><path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8V195.4a48,48,0,0,1,19-37.9l.8-.7a24,24,0,1,0-33.9-33.9l-.7.8a48,48,0,0,1-37.9,19H16a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H44.6a48,48,0,0,1,37.9-19l.7-.8a24,24,0,1,0,33.9,33.9l.8.7a48,48,0,0,1,19,37.9V88h28.6a48.4,48.4,0,0,1,43.8,32.3,8,8,0,0,1-14.8,6.9,32.4,32.4,0,0,0-29-21.2H168Z"></path></svg>
                                    </div>
                                    <h1 className="text-xl font-bold font-display">لوحة التحكم</h1>
                                </div>
                                <nav className="flex flex-col gap-1 flex-grow">
                                    {sidebarNavLinks.map((link) => (
                                        <Link key={link.href} href={link.href}>
                                            <Button variant="ghost" className="w-full justify-start gap-3 text-base px-3 h-11 text-muted-foreground">
                                                <span className="w-5">{link.icon}</span>
                                                {link.title}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-auto">
                                    <Button onClick={onLogout} disabled={isLoggingOut} variant="ghost" className="w-full justify-start gap-3 text-base px-3 h-11 text-red-500/80 hover:text-red-500">
                                        {isLoggingOut ? <Loader2 className="w-5 animate-spin" /> : <LogOut className="w-5" />}
                                        {isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <Link href="/" passHref>
                   <Button variant="outline" className="gap-2">
                       <ExternalLink className="h-4 w-4" />
                       <span className="hidden sm:inline">عرض الموقع</span>
                   </Button>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                {/* <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button> */}
                <Avatar>
                    {profile.profileImage && (         
                        <AvatarImage src={profile.profileImage}  />
                    )}
                    <AvatarFallback>م</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}


// --- المكون الرئيسي للتخطيط ---
export default function DashboardLayout({ children }) {
    const { request, loading: isLoggingOut } = useApiRequest();
    const router = useRouter();
    const { user, clearUser } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // هذا التأثير يعمل مرة واحدة عند تحميل المكون للإشارة إلى أن الحالة قد تم تحديثها
        setIsReady(true);
    }, []);
    
    useEffect(() => {
        // هذا التأثير يعمل بعد أن يصبح المكون جاهزًا
        // إذا كان المكون جاهزًا ولا يوجد مستخدم، قم بإعادة التوجيه
        if (isReady && !user) {
            router.push("/admin/login");
        }
    }, [user, isReady, router]);

    const handleLogout = async () => {
        const result = await request(() => globalApi.logout());
        if (result.success) {
            showToast("success", "تم تسجيل الخروج بنجاح");
            clearUser();
            router.push("/admin/login");
        } else {
            showToast("error", result.error || "فشل تسجيل الخروج");
        }
    };
    

    if (!isReady || !user) {
        return <FullScreenLoader />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-row-reverse">
            <Sidebar onLogout={handleLogout} isLoggingOut={isLoggingOut} />
            <div className="flex-1 flex flex-col lg:mr-64">
                <DashboardHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />
                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
