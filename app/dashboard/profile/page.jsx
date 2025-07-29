"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, User, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";
import useAuthStore from "@/store/authStore";


export default function ProfilePage() {
    const { request: fetchProfile, loading: isLoading } = useApiRequest();
    const { request: updateProfile, loading: isSaving } = useApiRequest();
    const { user, setUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', // <-- تمت الإضافة هنا
        bio: '',
        socialLinks: { instagram: '', twitter: '', linkedin: '' }
    });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchProfile(() => globalApi.getMyProfile());
            if (result.success) {
                const profile = result.data.data;
                setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '', // <-- تمت الإضافة هنا
                    bio: profile.bio || '',
                    socialLinks: profile.socialLinks || { instagram: '', twitter: '', linkedin: '' }
                });
                setProfileImagePreview(profile.profileImage || '');
            } else {
                showToast("error", "فشل جلب بيانات الملف الشخصي.");
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSocialChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [id]: value }
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('email', formData.email);
        submissionData.append('phone', formData.phone); // <-- تمت الإضافة هنا
        submissionData.append('bio', formData.bio);
        submissionData.append('socialLinks', JSON.stringify(formData.socialLinks));
        
        if (profileImageFile) {
            submissionData.append('profileImage', profileImageFile);
        }

        const result = await updateProfile(() => globalApi.updateMyProfile(submissionData));

        if (result.success) {
            showToast("success", "تم تحديث الملف الشخصي بنجاح!");
            setUser(result.data.data.user); // تحديث المستخدم في الحالة العامة
        } else {
            showToast("error", result.error || "فشل تحديث الملف الشخصي.");
        }
    };

    if (isLoading) {
        return (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid gap-8">
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1"><Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card></div>
            </div>
        );
    }

    return (
        <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div>
                <h1 className="text-3xl font-bold font-display">الملف الشخصي</h1>
                <p className="text-muted-foreground">قم بتحديث معلوماتك الشخصية والمهنية هنا.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>المعلومات الشخصية</CardTitle>
                            <CardDescription>هذه المعلومات ستظهر في صفحة "من أنا" في موقعك.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">الاسم الكامل</Label>
                                <Input id="name" value={formData.name || ''} onChange={handleChange} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input id="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">السيرة الذاتية / قصتك</Label>
                                <Textarea id="bio" value={formData.bio || ''} onChange={handleChange} rows={8} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>الشبكات الاجتماعية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="instagram">رابط انستغرام</Label>
                                <div className="relative">
                                    <Instagram className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="instagram" value={formData.socialLinks?.instagram || ''} onChange={handleSocialChange} className="pr-10" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="twitter">رابط تويتر (X)</Label>
                                <div className="relative">
                                    <Twitter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="twitter" value={formData.socialLinks?.twitter || ''} onChange={handleSocialChange} className="pr-10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 grid gap-8 lg:sticky lg:top-24">
                    <Card>
                        <CardHeader>
                            <CardTitle>الصورة الشخصية</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <Avatar className="w-32 h-32 border-4 border-primary/20">
                                <AvatarImage src={profileImagePreview} />
                                <AvatarFallback>{formData.name ? formData.name.charAt(0) : 'م'}</AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <Button asChild variant="outline" className="w-full cursor-pointer">
                                    <label htmlFor="profile-upload"><Upload className="ml-2 h-4 w-4" />تغيير الصورة</label>
                                </Button>
                                <Input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </CardContent>
                    </Card>
                    <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
                        {isSaving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                        حفظ التغييرات
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
