"use client";

import { Camera, Instagram, Linkedin, Twitter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useProfile } from "@/app/contexts/ProfileProvider";

export default function Footer() {
    const { profile, isLoading } = useProfile(); // 2. استدعاء الـ Hook للحصول على البيانات

    return (
        <footer className="w-full bg-card border-t border-border">
            <div className="container mx-auto py-12 px-4">
                <div className="grid md:grid-cols-4 gap-8 text-center md:text-right">
                    <div className="md:col-span-1">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <Camera className="h-7 w-7 text-primary" />
                            {isLoading ? (
                                <Skeleton className="h-8 w-40" />
                            ) : (
                                <span className="font-display text-2xl font-bold">{profile?.name || 'اسم المصور'}</span>
                            )}
                        </div>
                        <p className="text-muted-foreground">فن التقاط اللحظات الخالدة.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">الرئيسية</Link></li>
                            <li><Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">المشاريع</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">من أنا</Link></li>
                            <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">الخدمات</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg mb-4">تواصل</h4>
                        <ul className="space-y-2">
                            {/* يمكنك ربط هذه البيانات لاحقًا إذا أضفتها للملف الشخصي */}
                            <li><a href={`mailto:${profile?.email || "contact@example.com"}`} className="text-muted-foreground hover:text-primary transition-colors">{profile?.email || "contact@example.com"}</a></li>
                            <li><a href={`tel:${profile?.phone || "+966000000000"}`} className="text-muted-foreground hover:text-primary transition-colors">{profile?.phone || "+966000000000"}</a></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg mb-4">تابعني</h4>
                        <div className="flex justify-center md:justify-start gap-4 mt-2">
                           {isLoading ? (
                                <div className="flex gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-6 w-6 rounded-full" /></div>
                           ) : (
                                <>
                                    {profile?.socialLinks?.instagram && <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></a>}
                                    {profile?.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>}
                                    {profile?.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin /></a>}
                                </>
                           )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-sm">
                    {isLoading ? (
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    ) : (
                        <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ {profile?.name || '[اسم المصور]'}.</p>
                    )}
                </div>
            </div>
        </footer>
    );
}
