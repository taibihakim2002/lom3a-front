"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Heart, Aperture, ShoppingBag, Sparkles, ArrowLeft, Send, Loader, CheckCircle, AlertCircle, Calendar, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

// --- بيانات الخدمات مع صور ---
const services = [
    { name: "تصوير زفاف", icon: <Heart/>, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1740&auto=format&fit=crop' },
    { name: "بورتريه", icon: <Aperture/>, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1664&auto=format&fit=crop' },
    { name: "تصوير منتجات", icon: <ShoppingBag/>, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1740&auto=format&fit=crop' },
    { name: "مناسبات أخرى", icon: <Sparkles/>, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1740&auto=format&fit=crop' },
];

export default function BookingPage() {
    const { request, loading } = useApiRequest();
    const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'success'
    const [selectedService, setSelectedService] = useState(services[0].name);
    const [currentService, setCurrentService] = useState(services[0]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        const finalData = { 
            ...data, 
            service: selectedService,
            bookingDate: data.date, // Ensure field names match the backend model
            bookingTime: data.time,
        };
        
        const result = await request(() => globalApi.createBooking(finalData));

        if (result.success) {
            setFormStatus('success');
            reset();
            setSelectedService(services[0].name);
            setCurrentService(services[0]);
        } else {
            showToast("error", result.error || "حدث خطأ ما، الرجاء المحاولة مرة أخرى.");
        }
    };

    return (
        <>
            <Header />
            <main className="bg-background">

                {/* Hero Section */}
                <section className="relative py-28 md:py-40 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center animate-ken-burns"></div>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.h1 className="font-display text-5xl md:text-7xl font-extrabold text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            احجز جلستك الآن
                        </motion.h1>
                        <motion.p className="mt-4 max-w-xl mx-auto text-lg text-neutral-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                            خطوات بسيطة تفصلك عن توثيق لحظاتك التي لا تُنسى.
                        </motion.p>
                    </div>
                </section>

                {/* Booking Section */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                            {/* Left Side - Visual */}
                            <div className="w-full lg:sticky lg:top-28">
                                <AnimatePresence mode="wait">
                                    <motion.div key={currentService.name} className="relative w-full h-[60vh] lg:h-[75vh] rounded-2xl overflow-hidden shadow-2xl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                                        <Image src={currentService.image} alt={currentService.name} layout="fill" objectFit="cover" className="brightness-75" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 text-white"><h2 className="font-display text-5xl font-bold">{currentService.name}</h2><p className="text-lg mt-2 opacity-80">دعنا نوثق هذه اللحظات معًا</p></div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Right Side - Form */}
                            <div className="w-full">
                                <div className="max-w-lg mx-auto lg:mx-0">
                                    {formStatus === 'success' ? (
                                        <motion.div 
    className="text-center py-12 bg-card rounded-lg h-full flex flex-col justify-center items-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
>
    <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
    <h2 className="text-3xl font-bold font-display mb-3">خطوة رائعة! تم إرسال طلبك</h2>
    <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        طلبك الآن قيد المراجعة، وقد أرسلنا إلى بريدك الإلكتروني رابطًا يمكنك من خلاله متابعة حالة الحجز.
    </p>
    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        سنقوم بالتواصل معك قريبًا فور تأكيد التفاصيل.
    </p>
    <Button onClick={() => setFormStatus('idle')}>حجز موعد جديد</Button>
</motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                            <div>
                                                <Label className="text-lg font-semibold mb-3 block">1. اختر نوع الخدمة</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {services.map(service => (
                                                        <button type="button" key={service.name} onClick={() => { setCurrentService(service); setSelectedService(service.name); }} className={cn("flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300", selectedService === service.name ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50")}>
                                                            <div className={cn("transition-colors", selectedService === service.name ? "text-primary" : "text-muted-foreground")}>{service.icon}</div>
                                                            <span className="mt-2 font-semibold text-sm">{service.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-lg font-semibold mb-3 block">2. حدد التاريخ والوقت</Label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="date">التاريخ</Label>
                                                        <div className="relative"><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="date" type="date" {...register('date', { required: "حقل التاريخ مطلوب" })} className="h-12 pr-10" /></div>
                                                        {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="time">الوقت التقريبي</Label>
                                                        <div className="relative"><Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="time" type="time" {...register('time', { required: "حقل الوقت مطلوب" })} className="h-12 pr-10" /></div>
                                                        {errors.time && <p className="text-destructive text-sm mt-1">{errors.time.message}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-lg font-semibold mb-3 block">3. معلوماتك الشخصية</Label>
                                                <div className="space-y-4">
                                                    <div className="space-y-2"><Label htmlFor="name">الاسم الكامل</Label><div className="relative"><User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="name" {...register('name', { required: "حقل الاسم مطلوب" })} className="h-12 pr-10" /></div>{errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}</div>
                                                    <div className="space-y-2"><Label htmlFor="email">البريد الإلكتروني</Label><div className="relative"><Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="email" type="email" {...register('email', { required: "حقل البريد الإلكتروني مطلوب" })} className="h-12 pr-10" /></div>{errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}</div>
                                                    <div className="space-y-2"><Label htmlFor="phone">رقم الهاتف</Label><div className="relative"><Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="phone" type="tel" {...register('phone')} className="h-12 pr-10" /></div></div>
                                                    <div className="space-y-2"><Label htmlFor="location">الموقع</Label><div className="relative"><MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="location" {...register('location')} className="h-12 pr-10" /></div></div>
                                                    <div className="space-y-2"><Label htmlFor="message">رسالة إضافية</Label><Textarea id="message" {...register('message')} placeholder="أخبرني المزيد عن مناسبتك..." /></div>
                                                </div>
                                            </div>

                                            <Button type="submit" size="lg" className="w-full font-bold h-14 text-lg" disabled={loading}>
                                                {loading ? <Loader className="ml-2 h-5 w-5 animate-spin" /> : <Send className="ml-2 h-5 w-5" />}
                                                {loading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
