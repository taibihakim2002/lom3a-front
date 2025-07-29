"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";
import { useProfile } from '../contexts/ProfileProvider';

// FAQ Data
const faqs = [
    { question: "ما هي مدة تسليم الصور النهائية؟", answer: "عادةً ما يتم تسليم الصور النهائية بعد معالجتها خلال فترة تتراوح من أسبوعين إلى أربعة أسابيع، حسب حجم المشروع ونوع المناسبة." },
    { question: "هل تقدم خدمات تصوير الفيديو؟", answer: "نعم، أقدم خدمات تصوير الفيديو كإضافة لخدمات التصوير الفوتوغرافي. يمكننا مناقشة التفاصيل لتصميم باقة تناسب احتياجاتكم." },
    { question: "كيف يمكنني حجز موعد؟", answer: "يمكنك حجز موعد عبر ملء نموذج التواصل في هذه الصفحة، أو عبر الاتصال المباشر على الرقم أو البريد الإلكتروني الموضحين. يتطلب الحجز دفع عربون لتأكيد الموعد." },
    { question: "هل تقوم بالتصوير خارج مدينتي؟", answer: "بالتأكيد! أنا مستعد للسفر لتغطية مناسباتكم في أي مكان. يتم تطبيق رسوم إضافية لتغطية تكاليف السفر والإقامة." }
];

export default function ContactPage() {
    const { profile, isLoading: isProfileLoading } = useProfile();
    const { request, loading: isSending } = useApiRequest();
    const [formStatus, setFormStatus] = useState('idle');

    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 2) newErrors.name = 'يجب أن يتكون الاسم من حرفين على الأقل.';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'الرجاء إدخال بريد إلكتروني صالح.';
        if (!formData.subject || formData.subject.length < 5) newErrors.subject = 'يجب أن يتكون الموضوع من 5 أحرف على الأقل.';
        if (!formData.message || formData.message.length < 10) newErrors.message = 'يجب أن تتكون الرسالة من 10 أحرف على الأقل.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const result = await request(() => globalApi.createMessage(formData));
        
        if (result.success) {
            setFormStatus('success');
            setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
            setFormStatus('error');
            showToast("error", result.error || "فشل إرسال الرسالة.");
        }
    };

    return (
        <>
            <Header />
            <main className="bg-background">

                <section className="relative py-28 md:py-40 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center animate-ken-burns"></div>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.h1
                            className="font-display text-5xl md:text-7xl font-extrabold text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            تواصل معي
                        </motion.h1>
                        <motion.p
                            className="mt-4 max-w-xl mx-auto text-lg text-neutral-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            هل لديك فكرة مشروع أو استفسار؟ أنا هنا للاستماع. دعنا نصنع شيئًا رائعًا معًا.
                        </motion.p>
                    </div>
                </section>

                <section className="py-24 sm:py-32">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12">
                            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
                                <Card className="p-8 border-border/50">
                                    <CardHeader>
                                        <CardTitle className="text-3xl font-display">أرسل رسالة</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {formStatus === 'success' ? (
                                            <div className="text-center py-12">
                                                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                                                <h3 className="text-2xl font-bold">شكرًا لك!</h3>
                                                <p className="text-muted-foreground mt-2">تم إرسال رسالتك بنجاح، سأقوم بالرد في أقرب وقت.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <Input id="name" value={formData.name} onChange={handleChange} placeholder="الاسم الكامل" className="h-12" />
                                                        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                                                    </div>
                                                    <div>
                                                        <Input id="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="h-12" />
                                                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Input id="subject" value={formData.subject} onChange={handleChange} placeholder="الموضوع" className="h-12" />
                                                    {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
                                                </div>
                                                <div>
                                                    <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="رسالتك..." rows={6} />
                                                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                                                </div>
                                                <Button type="submit" size="lg" className="w-full font-bold" disabled={isSending}>
                                                    {isSending ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Send className="ml-2 h-5 w-5" />}
                                                    {isSending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                                                </Button>
                                                {formStatus === 'error' && <div className="flex items-center gap-2 text-destructive"><AlertCircle /> حدث خطأ ما. الرجاء المحاولة مرة أخرى.</div>}
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div className="space-y-8" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
                                {isProfileLoading ? (
                                    <div className="space-y-8">
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-4 p-6 rounded-lg bg-card">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary"><Mail className="h-6 w-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold">البريد الإلكتروني</h3>
                                                <p className="text-muted-foreground">تواصل معي مباشرة عبر البريد.</p>
                                                <a href={`mailto:${profile?.email}`} className="text-primary mt-1 block">{profile?.email}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-6 rounded-lg bg-card">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary"><Phone className="h-6 w-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold">الهاتف</h3>
                                                <p className="text-muted-foreground">للاستفسارات العاجلة.</p>
                                                <a href={`tel:${profile?.phone}`} className="text-primary mt-1 block" dir="ltr">{profile?.phone}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-6 rounded-lg bg-card">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary"><MapPin className="h-6 w-6" /></div>
                                            <div>
                                                <h3 className="text-xl font-bold">الموقع</h3>
                                                <p className="text-muted-foreground">الرياض، المملكة العربية السعودية</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-24 sm:py-32 bg-card">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-4xl md:text-5xl font-bold">أسئلة شائعة</h2>
                            <p className="text-muted-foreground mt-4">إجابات لبعض الأسئلة التي قد تدور في ذهنك.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg text-right font-bold">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
