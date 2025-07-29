"use client";

import { motion } from "framer-motion";
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ArrowLeft, Heart, Aperture, ShoppingBag, Video, Paperclip, Sparkles } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

// --- بيانات الخدمات الرئيسية ---
const mainServices = [
    {
        title: "تصوير زفاف",
        icon: <Heart className="h-8 w-8 text-primary" />,
        description: "أؤمن بأن يوم الزفاف هو فصل فريد في قصة حبكم، ومهمتي هي توثيق هذا الفصل بكل تفاصيله العفوية والمؤثرة. أركز على التقاط المشاعر الحقيقية، من نظرة الحب الأولى حتى دمعة الفرح، لإنشاء ذكريات سينمائية تدوم مدى الحياة.",
        features: ["تغطية شاملة من التحضيرات إلى نهاية الحفل", "جلسة تصوير خاصة للعروسين", "صور عالية الدقة ومعالجة احترافية", "تسليم سريع في معرض صور رقمي خاص"],
        image: "https://images.unsplash.com/photo-1523438097201-512ae7d59c44?q=80&w=1632&auto=format&fit=crop",
        align: "right"
    },
    {
        title: "تصوير بورتريه",
        icon: <Aperture className="h-8 w-8 text-primary" />,
        description: "جلسة البورتريه هي أكثر من مجرد صورة، إنها استكشاف للشخصية. سواء كانت جلسة شخصية، عائلية، أو مهنية، أعمل على خلق أجواء مريحة تبرز جمالكم الطبيعي وتلتقط جوهركم الحقيقي في صور فنية ومعبرة.",
        features: ["جلسات تصوير داخلية أو خارجية", "استشارة لاختيار الموقع والأزياء", "صور متعددة الأوضاع والأساليب", "مرونة في عدد الصور النهائية"],
        image: "https://images.unsplash.com/photo-1581338834611-23e47d58a368?q=80&w=1587&auto=format&fit=crop",
        align: "left"
    },
    {
        title: "تصوير منتجات",
        icon: <ShoppingBag className="h-8 w-8 text-primary" />,
        description: "في عالم التجارة الإلكترونية، الصورة هي واجهة علامتك التجارية. أقدم خدمات تصوير منتجات احترافية تبرز جودة وتفاصيل منتجاتكم، وتجذب انتباه العملاء المستهدفين بصور نظيفة، أنيقة، وعالية الجودة.",
        features: ["صور بخلفيات بيضاء أو ملونة", "تصوير إبداعي للمنتجات في سياقها", "إضاءة احترافية تبرز التفاصيل", "صور محسّنة للاستخدام على الويب والمطبوعات"],
        image: "https://images.unsplash.com/photo-1620912189837-e54c15734040?q=80&w=1587&auto=format&fit=crop",
        align: "right"
    }
];

// --- بيانات الخدمات الإضافية ---
const additionalServices = [
    { title: "فيديو قصير (هايلايت)", icon: <Video /> },
    { title: "تصوير جوي (درون)", icon: <Sparkles /> },
    { title: "ألبومات صور فاخرة", icon: <Paperclip /> },
    { title: "جلسات تصوير ما قبل الزفاف", icon: <Heart /> },
];

// --- بيانات الأسئلة الشائعة ---
const faqs = [
    {
        question: "كيف يتم تسعير الخدمات؟",
        answer: "يعتمد التسعير على عدة عوامل منها نوع الخدمة، عدد ساعات التغطية، الموقع، والخدمات الإضافية المطلوبة. أفضل طريقة هي التواصل معي لمناقشة تفاصيل مشروعك وسأقوم بتزويدك بعرض سعر مخصص."
    },
    {
        question: "ماذا تشمل 'معالجة الصور'؟",
        answer: "تشمل معالجة الصور تعديل الألوان، التباين، الإضاءة، والحدة لضمان ظهور كل صورة بأفضل شكل ممكن. كما تشمل تنقيحًا أساسيًا للصور الشخصية (البورتريه)."
    },
    {
        question: "ما هي مدة تسليم العمل النهائي؟",
        answer: "تختلف مدة التسليم حسب نوع المشروع. بشكل عام، تتراوح بين أسبوعين إلى أربعة أسابيع. سيتم تحديد المدة الدقيقة في عرض السعر المقدم لك."
    }
];

export default function ServicesPage() {
    return (
        <>
            <Header />
            <main className="bg-background">

                {/* 1. Hero Section */}
                <section className="relative py-28 md:py-40 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1632&auto=format&fit=crop')] bg-cover bg-center animate-ken-burns"></div>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.h1 className="font-display text-5xl md:text-7xl font-extrabold text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            خدماتي الإبداعية
                        </motion.h1>
                        <motion.p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                            حلول تصوير متكاملة مصممة لتروي قصتكم بأسلوب فني فريد.
                        </motion.p>
                    </div>
                </section>

                {/* 2. Main Services Section */}
                <section className="py-24 sm:py-32">
                    <div className="container mx-auto px-4 space-y-24">
                        {mainServices.map((service, index) => (
                            <motion.div 
                                key={service.title}
                                className={`grid md:grid-cols-2 gap-12 items-center`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className={`relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl ${service.align === 'left' ? 'md:order-last' : ''}`}>
                                    <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        {service.icon}
                                        <h2 className="font-display text-4xl font-bold">{service.title}</h2>
                                    </div>
                                    <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
                                    <ul className="space-y-3 ">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-primary" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/contact">
                                        <Button size="lg" className="font-bold mt-3">
                                            طلب عرض سعر
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. Additional Services Section */}
                <section className="py-24 sm:py-32 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="font-display text-4xl md:text-5xl font-bold">خدمات إضافية</h2>
                            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">لإضافة لمسة خاصة لمشروعك، أقدم مجموعة من الخدمات المكملة.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {additionalServices.map((service, index) => (
                                <motion.div 
                                    key={service.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="bg-background text-center p-6 h-full">
                                        <div className="text-primary mx-auto w-fit mb-4">{service.icon}</div>
                                        <h3 className="font-bold text-lg">{service.title}</h3>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. How It Works Section */}
                <section className="py-24 sm:py-32">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="font-display text-4xl md:text-5xl font-bold">آلية العمل</h2>
                            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">أربع خطوات بسيطة تفصلنا عن توثيق لحظاتكم التي لا تُنسى.</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            {["الاستشارة", "التخطيط", "يوم التصوير", "التسليم النهائي"].map((step, index) => (
                                <div key={step} className="relative">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-card border-2 border-primary text-primary font-bold text-3xl font-display">
                                            {index + 1}
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold">{step}</h3>
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-10 left-1/2 w-full border-t-2 border-dashed border-border -z-10"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FAQ Section */}
                <section className="py-24 sm:py-32 bg-card">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-4xl md:text-5xl font-bold">أسئلة متكررة</h2>
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
