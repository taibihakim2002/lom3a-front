"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";
import useAuthStore from "@/store/authStore";
import { FullScreenLoader } from "@/components/global/FullScreenLoader";


export default function LoginPage() {
    const { request, loading } = useApiRequest();
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [isReady, setIsReady] = useState(false); // حالة جديدة لتتبع جاهزية المكون
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // هذا التأثير يعمل مرة واحدة عند تحميل المكون للإشارة إلى أن الحالة قد تم تحديثها
        setIsReady(true);
    }, []);

    useEffect(() => {
        // هذا التأثير يعمل عند تغير المستخدم أو جاهزية المكون
        if (isReady && user) {
            router.push('/dashboard');
        }
    }, [user, isReady, router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: null }));
        }
    };

    // التحقق من صحة المدخلات
    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "البريد الإلكتروني مطلوب.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "صيغة البريد الإلكتروني غير صالحة.";
        }
        if (!formData.password) {
            newErrors.password = "كلمة المرور مطلوبة.";
        }
        return newErrors;
    };

    // إرسال البيانات عند الضغط على الزر
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const result = await request(() => globalApi.adminLogin(formData));

        if (result.success) {
            showToast("success", "تم تسجيل الدخول بنجاح");
            setUser(result.data.user);
            router.push("/dashboard");
        } else {
            // عرض الخطأ القادم من السيرفر
            setErrors({ api: result.error });
            showToast("error", result.error);
        }
    };

    // إظهار شاشة التحميل إذا لم يكن المكون جاهزًا أو إذا كان المستخدم موجودًا (وقيد إعادة التوجيه)
    if (!isReady || user) {
        return <FullScreenLoader />;
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-background">
            {/* Right Side - Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="mx-auto grid w-[350px] gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold font-display">تسجيل الدخول</h1>
                        <p className="text-muted-foreground">
                            أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-12 pr-10"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                             {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">كلمة المرور</Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="password" 
                                    type="password" 
                                    className="h-12 pr-10"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        {errors.api && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <span>{errors.api}</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 font-bold text-base" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
            
            {/* Left Side - Visual */}
            <div className="hidden lg:block relative">
                 <Image
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1632&auto=format&fit=crop"
                    alt="صورة فنية للكاميرا"
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 flex flex-col justify-end h-full p-10 text-white">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold font-display">"التقاط اللحظات اليوم، لخلق ذكريات تدوم إلى الأبد."</h2>
                        <p className="mt-4 text-lg text-neutral-300">- اقتباس ملهم</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
