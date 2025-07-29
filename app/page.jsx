"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Camera, Clapperboard, MoveDown, ServerCrash, Sparkles, Instagram, Linkedin, Twitter, Heart, Aperture, ShoppingBag, Layers, Inbox, AlertCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import useApiRequest from '@/hooks/useApiRequest';
import globalApi from '@/utils/globalApi';
import { PhotographerLoader } from '@/components/global/PhotographerLoader';
import { useProfile } from './contexts/ProfileProvider';

// --- بيانات المشاريع (جديد) ---
const projectsData = [
    { 
        id: 'zefaf-sara-ahmed', 
        title: 'زفاف سارة وأحمد', 
        category: 'أعراس', 
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1740&auto=format&fit=crop' 
    },
    { 
        id: 'asrar-tabiaa', 
        title: 'أسرار الطبيعة', 
        category: 'طبيعة', 
        coverImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1740&auto=format&fit=crop' 
    },
    { 
        id: 'hawiyat-montaj', 
        title: 'هوية المنتج: عطور فاخرة', 
        category: 'منتجات', 
        coverImage: 'https://images.unsplash.com/photo-1612151832371-9de3371f4163?q=80&w=1740&auto=format&fit=crop' 
    },
];

// --- بيانات الصور الفردية ---
const galleryItems = [
  { id: 4, title: 'نظرة عميقة', category: 'بورتريه', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1664&auto=format&fit=crop', orientation: 'portrait' },
  { id: 5, title: 'عناق الغيوم', category: 'طبيعة', imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1740&auto=format&fit=crop', orientation: 'landscape' },
  { id: 6, title: 'وجه حالم', category: 'بورتريه', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop', orientation: 'portrait' },
  { id: 7, title: 'تفاصيل العرس', category: 'زفاف', imageUrl: 'https://images.unsplash.com/photo-1587280501635-33554b645437?q=80&w=1587&auto=format&fit=crop', orientation: 'portrait' },
  { id: 8, title: 'شاطئ الغروب', category: 'طبيعة', imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1740&auto=format&fit=crop', orientation: 'landscape' },
  { id: 9, title: 'هوية المنتج', category: 'منتجات', imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1740&auto=format&fit=crop', orientation: 'landscape' },
];
const testimonialsData = [
    { id: 1, name: 'سارة العبدالله', review: 'تحويل اللحظات العادية إلى ذكريات سينمائية. موهبة فذة وعين فنية لا مثيل لها.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'أحمد بن علي', review: 'الاحترافية والإبداع في كل صورة. لقد تجاوزت النتائج كل توقعاتنا.', avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: 3, name: 'فاطمة محمود', review: 'تجربة التصوير كانت ممتعة والنتيجة النهائية كانت لوحة فنية.', avatar: 'https://i.pravatar.cc/150?img=5' },
];


// ---------- قسم الـ Hero السينمائي ----------
function HeroSection() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    // تأثير Parallax: الخلفية تتحرك أبطأ من باقي الصفحة
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 0.2 }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div ref={targetRef} className="relative h-screen w-full overflow-hidden">
            <motion.div 
                className="absolute inset-0 z-0"
                style={{ y, opacity }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop"
                    alt="خلفية طبيعية ملهمة"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </motion.div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className="font-display text-5xl md:text-8xl font-extrabold"
                    >
                        تصوير يروي قصتك
                    </motion.h1>
                    <motion.p 
                        variants={itemVariants}
                        className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-200"
                    >
                        أُحوّل اللحظات العابرة إلى أعمال فنية خالدة، بعدسة تلتقط جوهر الإحساس وجمال التفاصيل.
                    </motion.p>
                    <motion.div variants={itemVariants}> 
                        <Link href="/projects">
                            <Button size="lg" className="mt-8 font-bold text-lg px-8 py-6 rounded-full group">
                                اكتشف أعمالي
                                <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            </Button>
                        </Link> 
                    </motion.div>
                </motion.div>
            </div>
            <motion.div 
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            > 
                <MoveDown className="h-8 w-8 text-white animate-bounce" /> 
            </motion.div>
        </div>
    );
}
// ---------- قسم المشاريع المميزة (جديد) ----------
function FeaturedProjects() {
    const { request: fetchProjectsRequest, loading, error } = useApiRequest();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // جلب أحدث 3 مشاريع فقط
            const result = await fetchProjectsRequest(() => globalApi.getAllProjects({ limit: 3, sort: '-createdAt' }));
            if (result.success && result.data.data) {
                setProjects(result.data.data);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-96 w-full rounded-xl" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12 text-destructive">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                    <p>فشل تحميل المشاريع المميزة.</p>
                </div>
            );
        }

        if (projects.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    <Inbox className="mx-auto h-12 w-12 mb-4" />
                    <p>لا توجد مشاريع مميزة لعرضها حاليًا.</p>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: index * 0.15 }}
                    >
                        <Link href={`/projects/${project.slug}`}>
                            <div className="group relative block w-full h-96 overflow-hidden rounded-xl shadow-lg">
                                <Image 
                                    src={project.coverImage} 
                                    alt={project.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-sm text-primary font-semibold">{project.category}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{project.title}</h3>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <section className="w-full py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2 className="font-display text-4xl md:text-5xl font-bold" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        مشاريع مميزة
                    </motion.h2>
                    <motion.p className="text-muted-foreground mt-4 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        نظرة على بعض القصص الكاملة التي تشرفت بتوثيقها.
                    </motion.p>
                </div>
                {renderContent()}
                <div className="text-center mt-12">
                    <Link href="/projects">
                        <Button size="lg" variant="outline">
                            عرض كل المشاريع
                            <Layers className="mr-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ---------- قسم لقطات فنية (المعرض سابقًا) ----------
function ArtisticShots() {
    const { request, loading, data: featuredMedia, error } = useApiRequest();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await request(() => globalApi.getFeaturedMedia());
            if (result.success && result.data.data.media) {
                setItems(result.data.data.media);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className={`h-[${i % 2 === 0 ? '400px' : '600px'}] w-full rounded-lg`} />
                    ))}
                </div>
            );
        }
        if (error) {
           return (
                <div className="text-center py-24 text-destructive col-span-full">
                    <ServerCrash className="mx-auto h-16 w-16 mb-4"/>
                    <p className="text-xl mb-4">عذرًا، حدث خطأ أثناء جلب اللقطات الفنية.</p>
                </div>
            );
        }
        if (items.length === 0) {
            return (
                <div className="text-center py-24 text-muted-foreground col-span-full">
                    <Clapperboard className="mx-auto h-16 w-16 mb-4"/>
                    <p className="text-xl">لا توجد لقطات فنية لعرضها حاليًا.</p>
                </div>
            );
        }
        return (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {items.map(item => (
                    <motion.div 
                        key={item._id} // <-- استخدام ID من قاعدة البيانات
                        className="break-inside-avoid relative group overflow-hidden rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Image 
                            src={item.url} // <-- استخدام URL من قاعدة البيانات
                            alt="لقطة فنية"
                            width={500}
                            height={750} // يمكن تعديل هذا لاحقًا إذا حفظنا الأبعاد
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>
                ))}
            </div>
        );
    };
    
    return (
        <section className="w-full py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2 className="font-display text-4xl md:text-5xl font-bold" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} >
                        لقطات فنية
                    </motion.h2>
                    <motion.p className="text-muted-foreground mt-4 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        مجموعة من الصور الفردية المختارة التي تبرز جمال التفاصيل.
                    </motion.p>
                </div>
                {renderContent()}
            </div>
        </section>
    );
}

// ---------- نبذة عني ----------
function AboutMeSection({ profile, isLoading }) {
    if (isLoading) {
        return (
            <section className="w-full py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <Skeleton className="h-[600px] w-full rounded-lg" />
                        <div className="space-y-6">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-5/6" />
                            <Skeleton className="h-16 w-1/2 mt-8" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!profile) return null;

    return (
        <section className="w-full py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ duration: 0.8 }}
                        className="relative h-[300px] md:h-[500px] w-full"
                    >
                        {profile.profileImage && (
                            <Image 
                                src={profile.profileImage} 
                                alt={profile.name || 'Photographer'} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-lg shadow-xl" 
                            />
                        )}
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-right"
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-bold">فنان خلف العدسة</h2>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{profile.bio}</p>
                        <p className="font-signature text-5xl text-primary mt-8">{profile.name}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ---------- أبرز الخدمات ----------
function ServicesHighlight() {
    const services = [
        { icon: <Heart className="h-10 w-10 text-primary" />, title: "تصوير زفاف", description: "توثيق يومكم المميز بكل تفاصيله الرومانسية والعفوية بأسلوب سينمائي." },
        { icon: <Aperture className="h-10 w-10 text-primary" />, title: "بورتريه وجلسات", description: "جلسات تصوير شخصية أو عائلية تبرز جمالكم الطبيعي في مواقع مختارة بعناية." },
        { icon: <ShoppingBag className="h-10 w-10 text-primary" />, title: "تصوير منتجات", description: "صور احترافية عالية الجودة لمنتجاتكم تساهم في نمو علامتكم التجارية." },
    ];

    return (
        <section className="w-full py-24 bg-card">
             <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold">خدمات تليق بكم</h2>
                    <p className="text-muted-foreground mt-4 max-w-lg mx-auto">نقدم حلولاً إبداعية في التصوير لتلبية كافة احتياجاتكم.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                            <Card className="bg-background h-full text-center p-8 hover:border-primary border-transparent border-2 transition-all duration-300 transform hover:-translate-y-2">
                                <CardHeader>
                                    <div className="mx-auto w-fit mb-4">{service.icon}</div>
                                    <CardTitle className="font-display text-2xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    {service.description}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
             </div>
        </section>
    );
}

// ---------- آراء العملاء ----------
function TestimonialsCarousel() {
    const { request, loading, data: testimonialsData, error } = useApiRequest();
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const result = await request(() => globalApi.getPublicTestimonials());
            if (result.success && result.data.data.testimonials) {
                setTestimonials(result.data.data.testimonials);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (testimonials.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % testimonials.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [testimonials]);

    if (loading) {
        return (
            <section className="w-full py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
                    <Skeleton className="h-32 w-full max-w-3xl mx-auto" />
                </div>
            </section>
        );
    }
    
    // لا تعرض القسم إذا فشل التحميل أو كان فارغًا
    if (error || testimonials.length === 0) return null;

    return (
        <section className="w-full py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">شهادات أعتز بها</h2>
                <div className="relative h-64 overflow-hidden max-w-3xl mx-auto">
                    {testimonials.map((t, index) => (
                        <motion.div 
                            key={t._id} 
                            className="absolute inset-0 flex flex-col items-center justify-center" 
                            initial={{ opacity: 0, x: 50 }} 
                            animate={{ opacity: index === currentIndex ? 1 : 0, x: index === currentIndex ? 0 : 50 }} 
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-xl md:text-2xl italic text-foreground leading-relaxed">"{t.review}"</p>
                            <div className="flex items-center gap-4 mt-6">
                                <Avatar><AvatarImage src={t.clientImage} alt={t.clientName}/><AvatarFallback>{t.clientName.charAt(0)}</AvatarFallback></Avatar>
                                <span className="font-bold text-primary">{t.clientName}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// ---------- الدعوة النهائية لاتخاذ إجراء ----------
function FinalCTA() {
    return (
        <section className="w-full py-28 bg-card"> <div className="container mx-auto px-4 text-center"> <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" /> <h2 className="font-display text-4xl md:text-6xl font-bold">هل أنت مستعد لصنع السحر؟</h2> <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">دعنا نتعاون لتوثيق قصتك القادمة بأسلوب يتجاوز المألوف. أنا هنا لتحويل رؤيتك إلى حقيقة فنية.</p> <Button size="lg" className="mt-10 font-bold text-xl px-10 py-7 rounded-full group">تواصل معي الآن<ArrowLeft className="mr-2 h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1.5" /></Button> </div> </section>
    );
}


// ---------- المكون الرئيسي للصفحة ----------
export default function HomePage() {
   
  const { profile, isLoading } = useProfile();
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            setInitialLoad(false);
        }
    }, [isLoading]);


    if (initialLoad) {
        return <PhotographerLoader />;
    }

  return (
    <>
      <Header/>
      <main>
        <HeroSection />
        <FeaturedProjects />
        <AboutMeSection profile={profile} isLoading={isLoading} />
        <ServicesHighlight />
        <ArtisticShots />
        <TestimonialsCarousel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
