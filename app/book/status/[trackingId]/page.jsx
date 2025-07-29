"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, XCircle, FileText, MessageSquare, AlertCircle, SearchX, ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";

// --- مكونات مساعدة ---
function StatusIcon({ status }) {
    if (status === 'مؤكد') return <CheckCircle className="h-12 w-12 text-green-500" />;
    if (status === 'ملغي') return <XCircle className="h-12 w-12 text-destructive" />;
    return <Clock className="h-12 w-12 text-yellow-500" />;
}

// --- START: تعديل StatusTimeline ---
function StatusTimeline({ status }) {
    const steps = [
        { name: 'الطلب مُرسل' },
        { name: 'قيد المراجعة' },
        { name: status === 'ملغي' ? 'تم الإلغاء' : 'تم التأكيد' }
    ];

    let activeIndex = 0;
    if (status === 'مؤكد' || status === 'ملغي' || status === 'مكتمل') {
        activeIndex = 2;
    } else if (status === 'بانتظار التأكيد') {
        activeIndex = 1;
    }

    return (
        <div className="w-full max-w-md mx-auto my-8 px-4">
            <div className="relative flex justify-between items-start">
                {/* الخط الخلفي الذي يربط بين المراحل */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                {/* الخط الملون الذي يمثل التقدم */}
                <motion.div 
                    className="absolute top-5 right-0 h-0.5 bg-primary -translate-y-1/2"
                    initial={{ width: "0%" }}
                    animate={{ width: `${activeIndex * 50}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center z-10 w-1/3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative bg-card",
                            index <= activeIndex ? 'border-primary' : 'border-border'
                        )}>
                             {index < activeIndex ? (
                                <Check className="h-6 w-6 text-primary" />
                            ) : (
                                <span className={cn("text-sm font-bold", index <= activeIndex ? 'text-primary' : 'text-muted-foreground')}>{index + 1}</span>
                            )}
                            {index === activeIndex && status !== 'ملغي' && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            )}
                        </div>
                        <p className={cn("mt-2 text-xs sm:text-sm font-semibold", index <= activeIndex ? 'text-foreground' : 'text-muted-foreground')}>{step.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
// --- END: تعديل StatusTimeline ---


export default function BookingStatusPage() {
    const params = useParams();
    const { trackingId } = params;
    const { request, loading, data, error } = useApiRequest();
    const [booking, setBooking] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (trackingId) {
            const fetchData = async () => {
                const result = await request(() => globalApi.getBookingByTrackingId(trackingId));
                if (result.success) {
                    setBooking(result.data.data.booking);
                }
                setInitialLoading(false);
            };
            fetchData();
        } else {
            setInitialLoading(false);
        }
    }, [trackingId]);

    const renderContent = () => {
        if (initialLoading) {
            return (
                <div className="w-full max-w-2xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            );
        }

        if (error || !booking) {
            return (
                <div className="text-center">
                    <SearchX className="mx-auto h-24 w-24 text-destructive mb-6" />
                    <h2 className="text-3xl font-bold font-display mb-2">تعذر العثور على الحجز</h2>
                    <p className="text-muted-foreground mb-8">قد يكون الرابط غير صحيح أو تم حذف الحجز.</p>
                    <Link href="/"><Button>العودة إلى الرئيسية</Button></Link>
                </div>
            );
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-full max-w-2xl mx-auto overflow-hidden">
                    <CardHeader className="text-center bg-card-foreground/5 p-8">
                        <StatusIcon status={booking.status} />
                        <CardTitle className="text-3xl font-display mt-4">حالة طلبك: {booking.status}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <StatusTimeline status={booking.status} />
                        
                        {booking.status === 'مؤكد' && booking.confirmationNotes && (
                            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <h4 className="font-bold flex items-center gap-2"><MessageSquare className="h-5 w-5"/> ملاحظة القبول:</h4>
                                <p className="text-muted-foreground mt-2">{booking.confirmationNotes}</p>
                            </div>
                        )}

                        {booking.status === 'ملغي' && booking.rejectionReason && (
                            <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <h4 className="font-bold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> سبب الإلغاء:</h4>
                                <p className="text-muted-foreground mt-2">{booking.rejectionReason}</p>
                            </div>
                        )}
                        
                        <div className="border-t mt-8 pt-6">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText className="h-5 w-5"/> تفاصيل طلبك:</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p><span className="font-semibold text-foreground">الاسم:</span> {booking.name}</p>
                                <p><span className="font-semibold text-foreground">الخدمة:</span> {booking.service}</p>
                                <p><span className="font-semibold text-foreground">التاريخ:</span> {new Date(booking.bookingDate).toLocaleDateString('en-us')} الساعة {booking.bookingTime}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <>
            <Header />
            <main className="bg-background py-24 sm:py-32">
                <div className="container mx-auto px-4">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </>
    );
}
