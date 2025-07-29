"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Camera, ServerCrash, ImageIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";

const filterTabs = ['الكل', 'زفاف', 'بورتريه', 'طبيعة', 'منتجات'];

export default function ProjectsPage() {
    const { request: fetchProjectsRequest, loading, error } = useApiRequest();
    const [projects, setProjects] = useState([]);
    const [activeFilter, setActiveFilter] = useState('الكل');

    useEffect(() => {
        const fetchData = async () => {
            const params = activeFilter === 'الكل' ? {} : { category: activeFilter };
            const result = await fetchProjectsRequest(() => globalApi.getAllProjects(params));
            
            if (result.success && result.data.data) {
                setProjects(result.data.data);
            } else if (result.error) {
                // The useApiRequest hook already sets the error state
                showToast("error", "فشل جلب المشاريع.");
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-80 w-full rounded-lg shimmer" />
                            <Skeleton className="h-6 w-3/4 rounded-lg shimmer" />
                            <Skeleton className="h-4 w-1/2 rounded-lg shimmer" />
                        </div>
                    ))}
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center py-24 text-destructive">
                    <ServerCrash className="mx-auto h-16 w-16 mb-4"/>
                    <p className="text-xl mb-4">{error}</p>
                    <Button variant="secondary" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                </div>
            );
        }
        if (projects.length === 0) {
            return (
                <div className="text-center py-24 text-muted-foreground">
                    <Camera className="mx-auto h-16 w-16 mb-4"/>
                    <p className="text-xl">لا توجد مشاريع في هذا القسم حاليًا.</p>
                </div>
            );
        }

        return (
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {projects.map(project => (
                        <motion.div
                            key={project._id}
                            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                            exit={{ opacity: 0, y: -50 }}
                            layout
                        >
                            <Link href={`/projects/${project.slug}`} className="block group">
                                <div className="relative overflow-hidden rounded-xl shadow-lg">
                                    <Image 
                                        src={project.coverImage} 
                                        alt={project.title}
                                        width={600}
                                        height={750}
                                        className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-primary font-semibold">{project.category}</p>
                                    <h3 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                                        <ImageIcon className="h-4 w-4" />
                                        <span>{project.media.length} وسائط</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <>
            <Header />
            <main className="bg-background">
                <section className="relative py-28 md:py-40 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483424122340-3e29b02a2102?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center animate-ken-burns"></div>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.h1 className="font-display text-5xl md:text-7xl font-extrabold text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            أعمالي
                        </motion.h1>
                        <motion.p className="mt-4 max-w-xl mx-auto text-lg text-neutral-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                            كل مشروع هو قصة فريدة نرويها بالضوء والظل. استكشف مجموعتي الكاملة من المشاريع.
                        </motion.p>
                    </div>
                </section>

                <section className="py-16 sm:py-24 relative">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex justify-center mb-12">
                            <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-4 p-2 rounded-full bg-card border">
                                {filterTabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={cn(
                                            "relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            activeFilter === tab ? "text-background" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {activeFilter === tab && (
                                            <motion.div layoutId="active-pill-projects" className="absolute inset-0 bg-primary rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                        )}
                                        <span className="relative z-10">{tab}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {renderContent()}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
