"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Button } from '@/components/ui/button';
import { Camera, Eye, Heart, Instagram, Linkedin, Twitter, Award, Calendar, Rocket } from 'lucide-react';

// --- بيانات وهمية للخط الزمني ---
const timelineEvents = [
    {
        icon: <Rocket className="h-6 w-6 text-primary" />,
        year: "2018",
        title: "بداية الرحلة",
        description: "أمسكت بأول كاميرا احترافية وبدأت في استكشاف عالم التصوير بشغف لا حدود له."
    },
    {
        icon: <Calendar className="h-6 w-6 text-primary" />,
        year: "2020",
        title: "أول مشروع مدفوع",
        description: "قمت بتصوير أول حفل زفاف، وكانت تلك اللحظة التي أدركت فيها أن هذا هو مساري المهني."
    },
    {
        icon: <Award className="h-6 w-6 text-primary" />,
        year: "2023",
        title: "جائزة مصور العام",
        description: "حصلت على تقدير محلي لأفضل صورة في فئة البورتريه، مما شكل دافعًا كبيرًا لي."
    },
    {
        icon: <Camera className="h-6 w-6 text-primary" />,
        year: "2025",
        title: "تأسيس الاستوديو الخاص بي",
        description: "افتتحت الاستوديو الخاص بي لتقديم خدمات تصوير متكاملة وتحقيق رؤيتي الفنية."
    }
];

// --- المكون الرئيسي للصفحة ---
export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        
        {/* 1. Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1740&auto=format&fit=crop"
                    alt="صورة شخصية للمصور"
                    layout="fill"
                    objectFit="cover"
                    className="animate-ken-burns"
                />
            </div>
            <div className="absolute inset-0 bg-black/60"></div>
            <motion.div 
                className="relative z-10 p-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="font-display text-5xl md:text-7xl font-extrabold">
                    فنان يرى العالم عبر عدسة
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-neutral-200 italic">
                    "التصوير هو قصيدة صامتة، وأنا أسعى لكتابة أجمل الأبيات في كل لقطة."
                </p>
            </motion.div>
        </section>

        {/* 2. Story Section */}
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-5 gap-12 items-center">
                    <motion.div 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                            قصتي مع الكاميرا
                        </h2>
                        <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                            <p>
                                لم أكن أخطط لأكون مصورًا، بل الكاميرا هي التي اختارتني. بدأت الحكاية كهواية بسيطة، محاولة لتوثيق الجمال الذي أراه في التفاصيل اليومية، من ضوء الشمس المتسلل عبر النافذة إلى ابتسامة عابرة في الشارع.
                            </p>
                            <p>
                                مع مرور الوقت، تحول هذا الشغف إلى هوس، وأصبحت عدستي هي نافذتي التي أرى بها العالم وأتفاعل معه. أؤمن بأن خلف كل وجه قصة، وفي كل مشهد إحساس، ومهمتي هي الكشف عن هذا الجوهر الخفي وتحويله إلى صورة خالدة.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="lg:col-span-3 h-[500px] relative rounded-xl overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                         <Image
                            src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1587&auto=format&fit=crop"
                            alt="صورة للمصور أثناء العمل"
                            layout="fill"
                            objectFit="cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>

        {/* 3. Timeline Section */}
        <section className="py-24 sm:py-32 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold">رحلتي المهنية</h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">محطات رئيسية شكلت هويتي كمصور فوتوغرافي.</p>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    {/* The vertical line */}
                    <div className="absolute right-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                    
                    <div className="space-y-12">
                        {timelineEvents.map((event, index) => (
                            <motion.div 
                                key={index}
                                className="relative flex items-start gap-6"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-card border-2 border-primary shadow-lg">
                                    {event.icon}
                                </div>
                                <div className="flex-1 pt-1.5">
                                    <p className="text-sm font-semibold text-primary">{event.year}</p>
                                    <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 4. My Philosophy Section */}
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }}>
                        <Eye className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h3 className="font-display text-2xl font-bold">رؤية فنية</h3>
                        <p className="text-muted-foreground mt-2">أبحث عن الجمال في غير المألوف، وأسعى لخلق تكوينات بصرية فريدة تتجاوز مجرد توثيق الواقع.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h3 className="font-display text-2xl font-bold">شغف بالتفاصيل</h3>
                        <p className="text-muted-foreground mt-2">أدق التفاصيل هي التي تصنع الفارق. أهتم بكل عنصر في الصورة، من الإضاءة إلى التكوين، لضمان الكمال.</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Camera className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h3 className="font-display text-2xl font-bold">أحدث المعدات</h3>
                        <p className="text-muted-foreground mt-2">أستخدم أحدث الكاميرات والعدسات لضمان أعلى جودة ممكنة للصور، وتقديم نتائج تفوق التوقعات.</p>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* 5. Final CTA */}
        <section className="py-24 sm:py-32 bg-card">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-display text-4xl font-bold">لنبقى على تواصل</h2>
                 <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                    تابعوا رحلتي وأحدث أعمالي على شبكات التواصل الاجتماعي، أو تواصلوا معي مباشرة لمناقشة مشروعكم القادم.
                 </p>
                 <div className="flex justify-center gap-6 mt-8 mb-10">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-7 w-7" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-7 w-7" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-7 w-7" /></a>
                 </div>
                 <Button size="lg" className="font-bold">
                    اكتشف معرض أعمالي
                 </Button>
            </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

