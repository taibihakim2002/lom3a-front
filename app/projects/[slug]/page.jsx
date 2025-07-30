"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player'; // <-- استيراد المكتبة

import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ServerCrash, X, ChevronLeft, ChevronRight, User, Calendar, MapPin, ArrowRight, PlayCircle, SearchX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

// --- مكون جديد لعرض "المشروع غير موجود" ---
function ProjectNotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <SearchX className="mx-auto h-24 w-24 text-primary mb-6" />
                <h1 className="text-4xl font-bold font-display mb-2">المشروع غير موجود</h1>
                <p className="text-lg text-muted-foreground max-w-md mb-8">
                    عذرًا، الرابط الذي اتبعته قد يكون معطوبًا أو قد تم حذف المشروع.
                </p>
                <Link href="/projects">
                    <Button size="lg">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        العودة إلى كل المشاريع
                    </Button>
                </Link>
            </main>
            <Footer />
        </div>
    );
}

export default function ProjectDetailPage({ params }) {
    const { slug } = params;
    const router = useRouter();
    const { request: fetchProject, loading, error } = useApiRequest();
    
    const [project, setProject] = useState(null);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
    const [hasMounted, setHasMounted] = useState(false); // <-- لمنع أخطاء SSR

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            const result = await fetchProject(() => globalApi.getProjectBySlug(slug));
            
            if (result.success && result.data.data) {
                setProject(result.data.data);
            } else {
                setProject({}); 
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const handleNavigation = (direction) => {
        if (selectedMediaIndex === null || !project) return;
        const newIndex = (selectedMediaIndex + direction + project.media.length) % project.media.length;
        setSelectedMediaIndex(newIndex);
    };

    if (loading || !project) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 py-24">
                    <Skeleton className="h-12 w-2/3 mx-auto mb-4 shimmer" />
                    <Skeleton className="h-8 w-1/3 mx-auto mb-12 shimmer" />
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className={`h-80 w-full rounded-lg shimmer`} />
                        ))}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!project._id) {
        return <ProjectNotFound />;
    }

    return (
        <>
            <Header />
            <main className="bg-background">
                {/* Hero Section */}
                <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <Image src={project.coverImage} alt={project.title} layout="fill" objectFit="cover" className="animate-ken-burns" priority />
                    </div>
                    <div className="absolute inset-0 bg-black/60"></div>
                    <motion.div className="relative z-10 p-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <p className="text-lg font-semibold text-primary">{project.category}</p>
                        <h1 className="font-display text-5xl md:text-7xl font-extrabold mt-2">{project.title}</h1>
                    </motion.div>
                </section>

                {/* Project Info & Description */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="grid md:grid-cols-3 gap-8 border-b border-border pb-12 mb-12">
                            <div className="flex items-center gap-4"><User className="h-8 w-8 text-primary" /><div><p className="text-muted-foreground">العميل</p><h3 className="font-bold text-lg">{project.client || 'غير محدد'}</h3></div></div>
                            <div className="flex items-center gap-4"><Calendar className="h-8 w-8 text-primary" /><div><p className="text-muted-foreground">التاريخ</p><h3 className="font-bold text-lg">{new Date(project.projectDate).toLocaleDateString('en-us')}</h3></div></div>
                            <div className="flex items-center gap-4"><MapPin className="h-8 w-8 text-primary" /><div><p className="text-muted-foreground">الموقع</p><h3 className="font-bold text-lg">{project.location || 'غير محدد'}</h3></div></div>
                        </div>
                        <div className="text-center">
                            <h2 className="font-display text-3xl font-bold mb-4">قصة المشروع</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">{project.description}</p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="pb-24">
                    <div className="container mx-auto px-4">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {project.media.map((mediaItem, index) => (
                                <motion.div
                                    key={mediaItem.url}
                                    className="break-inside-avoid relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    onClick={() => setSelectedMediaIndex(index)}
                                >
                                    <Image 
                                        src={mediaItem.type === 'image' ? mediaItem.url : mediaItem.thumbnailUrl || project.coverImage}
                                        alt={`${project.title} - Media ${index + 1}`}
                                        width={600}
                                        height={900}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        {mediaItem.type === 'video' && (
                                            <PlayCircle className="h-16 w-16 text-white" />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Back to Projects & CTA */}
                <section className="py-24 bg-card">
                    <div className="container mx-auto px-4 text-center">
                        <Link href="/projects"><Button variant="outline" className="mb-8"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى كل المشاريع</Button></Link>
                        <h2 className="font-display text-4xl font-bold">هل ألهمك هذا المشروع؟</h2>
                        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">دعنا نناقش كيف يمكننا توثيق قصتك القادمة بأسلوب مشابه.</p>
                        <Link href="/book"><Button size="lg" className="mt-8 font-bold">احجز جلستك الآن</Button></Link>
                    </div>
                </section>
            </main>

            {/* Lightbox Dialog */}
            <Dialog open={selectedMediaIndex !== null} onOpenChange={() => setSelectedMediaIndex(null)}>
                <DialogContent className="max-w-6xl w-full p-0 border-0 bg-transparent shadow-none !h-screen flex items-center justify-center">
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <button onClick={() => setSelectedMediaIndex(null)} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><X className="h-6 w-6" /></button>
                    <button onClick={() => handleNavigation(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><ChevronLeft className="h-8 w-8" /></button>
                    <button onClick={() => handleNavigation(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><ChevronRight className="h-8 w-8" /></button>
                    
                    <AnimatePresence mode="wait">
                        {selectedMediaIndex !== null && project.media[selectedMediaIndex] && (
                            <motion.div
                                key={selectedMediaIndex}
                                className="relative w-full h-full flex items-center justify-center p-8 md:p-16"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                {project.media[selectedMediaIndex].type === 'image' ? (
                                    <Image src={project.media[selectedMediaIndex].url} alt={`Image ${selectedMediaIndex + 1}`} width={1600} height={1200} className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                                ) : (
                                  
                                    <div className="aspect-video w-full max-w-5xl">
                                        {hasMounted && ( 
                                            <ReactPlayer
                                                url={project.media[selectedMediaIndex].url}
                                                width="100%"
                                                height="100%"
                                                controls={true}
                                                playing={false}
                                            />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
}
