"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FolderKanban, CalendarCheck2, Clock, CheckCircle, MoreHorizontal, Trash2, XCircle, Phone, MessageSquare, Mail, MapPin, AlertCircle, Inbox, Eye, Loader2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from "@/components/ui/skeleton";

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import useAuthStore from '@/store/authStore';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/utils/showToast';


// --- بيانات وهمية محدثة (للإحصائيات والحجوزات والرسم البياني) ---
const statsData = [
    { title: "إجمالي المشاريع", value: "73", icon: <FolderKanban className="h-5 w-5 text-muted-foreground" />, change: "+2 هذا الشهر", href: "/dashboard/projects" },
    { title: "الحجوزات المؤكدة", value: "25", icon: <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />, change: "+5 هذا الأسبوع", href: "/dashboard/bookings?status=confirmed" },
    { title: "الحجوزات المكتملة", value: "158", icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />, change: "+10% عن الشهر الماضي", href: "/dashboard/bookings?status=completed" },
    { title: "قيد الانتظار", value: "2", icon: <Clock className="h-5 w-5 text-muted-foreground" />, change: "تحتاج إلى تأكيد", href: "/dashboard/bookings?status=pending" },
];

const recentBookings = [
    { id: 1, name: "علياء محمد", email: "aliaa@example.com", phone: "0512345678", service: "تصوير زفاف", date: "2025-11-15", time: "18:00", location: "قاعة ليالينا، جدة", message: "حفل زفاف في قاعة ليالينا، نرجو تغطية كاملة من الساعة 6 مساءً.", status: "مؤكد" },
    { id: 2, name: "خالد الغامدي", email: "khaled@example.com", phone: "0587654321", service: "بورتريه", date: "2025-10-28", time: "15:30", location: "منتزه السلام، الرياض", message: "جلسة تصوير شخصية في الهواء الطلق.", status: "بانتظار التأكيد" },
    { id: 3, name: "نورة عبدالله", email: "noura@example.com", phone: "0555555555", service: "تصوير منتجات", date: "2025-10-22", time: "10:00", location: "استوديو العميل", message: "", status: "مؤكد" },
    { id: 4, name: "سلطان الأحمد", email: "sultan@example.com", phone: "0544444444", service: "تصوير زفاف", date: "2025-12-05", time: "19:00", location: "فندق الفيصلية، الرياض", message: "تم إلغاء الحجز من قبل العميل.", status: "ملغي" },
];

const chartData = [
    { day: 'السبت', bookings: 2 }, { day: 'الأحد', bookings: 3 }, { day: 'الاثنين', bookings: 1 },
    { day: 'الثلاثاء', bookings: 4 }, { day: 'الأربعاء', bookings: 2 }, { day: 'الخميس', bookings: 5 },
    { day: 'الجمعة', bookings: 3 },
];
function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                <Skeleton className="lg:col-span-2 h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
        </div>
    );
}

export default function DashboardPage() {
    const {user} = useAuthStore()
    
    const { request: fetchStats, loading: statsLoading } = useApiRequest();
    const { request: fetchProjects, loading: projectsLoading } = useApiRequest();
    const { request: fetchBookings, loading: bookingsLoading } = useApiRequest();
    const { request: fetchActivity, loading: activityLoading } = useApiRequest();
    const { request: updateBookingRequest, loading: isUpdating } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();

    // --- حالات البيانات ---
    const [stats, setStats] = useState({ totalProjects: 0, confirmedBookings: 0, completedBookings: 0, pendingBookings: 0 });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [chartData, setChartData] = useState([]);
    
    // --- حالات الواجهة ---
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [statusUpdateInfo, setStatusUpdateInfo] = useState(null);
    const [updateNotes, setUpdateNotes] = useState("");

    useEffect(() => {
        const loadAllData = async () => {
            const statsResult = await fetchStats(() => globalApi.getDashboardStats());
            if (statsResult.success) setStats(statsResult.data.data.stats);

            const projectsResult = await fetchProjects(() => globalApi.getAllProjects({ limit: 3, sort: '-createdAt' }));
            if (projectsResult.success) setRecentProjects(projectsResult.data.data);
            
            const bookingsResult = await fetchBookings(() => globalApi.getAllBookings({ limit: 4, sort: '-createdAt' }));
            if (bookingsResult.success) setRecentBookings(bookingsResult.data.data);

            const activityResult = await fetchActivity(() => globalApi.getBookingActivity());
            if (activityResult.success) setChartData(activityResult.data.data.activity);
        };
        loadAllData();
    }, []);

    // --- دوال التعامل مع الحجوزات ---
    const handleUpdateStatus = async () => {
        if (!statusUpdateInfo) return;
        const { id, status } = statusUpdateInfo;
        const payload = { 
            status,
            confirmationNotes: status === 'مؤكد' ? updateNotes : '',
            rejectionReason: status === 'ملغي' ? updateNotes : ''
        };
        const result = await updateBookingRequest(() => globalApi.updateBookingStatus(id, payload));
        if (result.success) {
            showToast("success", "تم تحديث حالة الحجز");
            setRecentBookings(prev => prev.map(b => b._id === id ? { ...b, ...result.data.data.booking } : b));

            setStatusUpdateInfo(null);
            setUpdateNotes("");
        } else {
            showToast("error", result.error || "فشل تحديث الحالة");
        }
    };
    const handleDirectUpdateStatus = async (id, status) => {
        const payload = { status };
        const result = await updateBookingRequest(() => globalApi.updateBookingStatus(id, payload));
        if (result.success) {
            showToast("success", "تم تحديث حالة الحجز بنجاح");
            setRecentBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));

        } else {
            showToast("error", result.error || "فشل تحديث الحالة");
        }
    };
    const handleDeleteBooking = async () => {
        if (!bookingToDelete) return;
        const result = await deleteRequest(() => globalApi.deleteBooking(bookingToDelete));
        if (result.success) {
            showToast("success", "تم حذف الحجز");
            setRecentBookings(prev => prev.filter(b => b._id !== bookingToDelete));
            setBookingToDelete(null);
        } else {
            showToast("error", result.error || "فشل حذف الحجز");
        }
    };

    const openStatusUpdateDialog = (booking, newStatus) => {
        setSelectedBooking(null);
        setStatusUpdateInfo({ id: booking._id, status: newStatus });
    };

     if (statsLoading || projectsLoading || bookingsLoading || activityLoading) {
        return <DashboardSkeleton />;
    }
    return (
        <>
            <motion.div
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Greeting */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold font-display">أهلاً بعودتك، {user.name}</h1>
                        <p className="text-muted-foreground">هذا هو ملخص نشاط موقعك لهذا اليوم.</p>
                    </div>
                    <Link href="/dashboard/projects/new">
                        <Button>إضافة مشروع جديد</Button>
                    </Link>
                </div>

                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* --- START: تعديل الإحصائيات --- */}
                    <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle><FolderKanban className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.totalProjects}</div>}</CardContent></Card>
                    <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">الحجوزات المؤكدة</CardTitle><CalendarCheck2 className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.confirmedBookings}</div>}</CardContent></Card>
                    <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">الحجوزات المكتملة</CardTitle><CheckCircle className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.completedBookings}</div>}</CardContent></Card>
                    <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle><Clock className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.pendingBookings}</div>}</CardContent></Card>
                    {/* --- END: تعديل الإحصائيات --- */}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Recent Bookings Table */}
                   <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>أحدث الحجوزات</CardTitle>
                            <CardDescription>انقر على أي حجز لعرض التفاصيل أو قم بإجراء سريع من القائمة.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookingsLoading ? <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> :
                            !recentBookings || recentBookings.length === 0 ? <p className="text-center text-muted-foreground py-8">لا توجد حجوزات حديثة.</p> :
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">العميل</TableHead>
                                        <TableHead className="hidden sm:table-cell text-right">الخدمة</TableHead>
                                        <TableHead className="text-right">الحالة</TableHead>
                                        <TableHead className="text-left">الإجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentBookings.map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell onClick={() => setSelectedBooking(booking)} className="cursor-pointer">
                                                <div><div className="font-medium">{booking.name}</div><div className="text-sm text-muted-foreground hidden md:block">{booking.email}</div></div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell" onClick={() => setSelectedBooking(booking)}>{booking.service}</TableCell>
                                            <TableCell onClick={() => setSelectedBooking(booking)}><Badge variant={booking.status === 'مؤكد' ? 'default' : booking.status === 'ملغي' ? 'destructive' : 'secondary'}>{booking.status}</Badge></TableCell>
                                            <TableCell className="text-left">
                                                {/* --- START: تعديل قائمة الإجراءات --- */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setSelectedBooking(booking)}><Eye className="ml-2 h-4 w-4" /> عرض التفاصيل</DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>تغيير الحالة</DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem onClick={() => openStatusUpdateDialog(booking, 'مؤكد')}>مؤكد</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openStatusUpdateDialog(booking, 'ملغي')}>ملغي</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDirectUpdateStatus(booking._id, 'مكتمل')}>مكتمل</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDirectUpdateStatus(booking._id, 'مكتمل')}>مكتمل</DropdownMenuItem>
                                             
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => setBookingToDelete(booking._id)}><Trash2 className="ml-2 h-4 w-4" /> حذف</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                {/* --- END: تعديل قائمة الإجراءات --- */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>}
                        </CardContent>
                    </Card>

                    {/* Recent Projects */}
                     <Card>
                        <CardHeader>
                            <CardTitle>آخر المشاريع</CardTitle>
                            <CardDescription>آخر 3 مشاريع قمت بإضافتها.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {projectsLoading ? <> <div className="flex items-center gap-4"><Skeleton className="w-20 h-20 rounded-md" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/3" /></div></div><div className="flex items-center gap-4"><Skeleton className="w-20 h-20 rounded-md" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/3" /></div></div></> :
                            !recentProjects || recentProjects.length === 0 ? <p className="text-center text-muted-foreground">لم تقم بإضافة أي مشاريع.</p> :
                            recentProjects.map((project) => (
                                <div key={project._id} className="flex items-center gap-4">
                                    <Image src={project.coverImage} alt={project.title} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                                    <div className="flex-1"><p className="font-semibold">{project.title}</p><Link href={`/dashboard/projects/${project._id}/edit`}><Button variant="link" className="p-0 h-auto text-xs">تعديل المشروع</Button></Link></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                
                {/* Activity Chart */}
                 <Card>
                    <CardHeader>
                        <CardTitle>نشاط الحجوزات</CardTitle>
                        <CardDescription>عدد طلبات الحجز خلال الأسبوع الماضي.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {/* --- START: تم التعديل هنا --- */}
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -40, bottom: 5 }}>
                                {/* --- END: تم التعديل هنا --- */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                                    <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Booking Details Dialog */}
            <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
                <DialogContent dir="rtl">
                    {selectedBooking && (
                        <>
                            <DialogHeader className="text-right">
                                <DialogTitle className="text-start">تفاصيل الحجز</DialogTitle>
                                <DialogDescription className="text-start">طلب حجز من {selectedBooking.name} لخدمة {selectedBooking.service}.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-6 text-right">
                                <div className="space-y-2">
                                    <p className="font-bold text-lg">{selectedBooking.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 justify-end"><Mail className="h-4 w-4" /> {selectedBooking.email}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 justify-end"><Phone className="h-4 w-4" /> {selectedBooking.phone}</p>
                                </div>
                                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                                    <p><span className="font-semibold text-muted-foreground block">الخدمة:</span>{selectedBooking.service}</p>
                                    <p><span className="font-semibold text-muted-foreground block">التاريخ:</span>{new Date(selectedBooking.bookingDate).toLocaleDateString('en-us')} الساعة {selectedBooking.bookingTime}</p>
                                    <p className="col-span-2"><span className="font-semibold text-muted-foreground block">الموقع:</span>{selectedBooking.location}</p>
                                    <p className="col-span-2"><span className="font-semibold text-muted-foreground block">الحالة الحالية:</span><Badge variant={selectedBooking.status === 'مؤكد' ? 'default' : selectedBooking.status === 'ملغي' ? 'destructive' : 'secondary'} className="mt-1">{selectedBooking.status}</Badge></p>
                                </div>
                                {selectedBooking.message && (<div className="border-t pt-4"><p className="font-semibold text-muted-foreground flex items-center gap-2 mb-2"><MessageSquare className="h-4 w-4" /> رسالة إضافية:</p><p className="text-sm bg-muted p-3 rounded-md">{selectedBooking.message}</p></div>)}
                            </div>
                             <DialogFooter className="gap-2 sm:justify-start flex-row-reverse">
                                {/* <-- تم تعديل الأزرار هنا لتستدعي دالة فتح نافذة الملاحظات --> */}
                                <Button size="sm" onClick={() => openStatusUpdateDialog(selectedBooking, 'مؤكد')}><CheckCircle className="ml-2 h-4 w-4" /> تأكيد</Button>
                                <Button variant="destructive" size="sm" onClick={() => openStatusUpdateDialog(selectedBooking, 'ملغي')}><XCircle className="ml-2 h-4 w-4" /> إلغاء الحجز</Button>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>إغلاق</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader><AlertDialogTitle className="text-start">هل أنت متأكد؟</AlertDialogTitle><AlertDialogDescription className="text-start">هذا الإجراء سيقوم بحذف الحجز بشكل نهائي.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>تراجع</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDeleteBooking} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            نعم، قم بالحذف
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             <AlertDialog open={!!statusUpdateInfo} onOpenChange={() => setStatusUpdateInfo(null)}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-start">
                            {statusUpdateInfo?.status === 'مؤكد' ? 'تأكيد الحجز' : 'إلغاء الحجز'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-start">
                            يمكنك إضافة رسالة اختيارية سيتم إرسالها للعميل مع تحديث الحالة.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="update-notes">
                            {statusUpdateInfo?.status === 'مؤكد' ? 'ملاحظات القبول (اختياري)' : 'سبب الرفض (اختياري)'}
                        </Label>
                        <Textarea 
                            id="update-notes" 
                            value={updateNotes}
                            onChange={(e) => setUpdateNotes(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUpdateNotes('')}>تراجع</AlertDialogCancel>
                        <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            {statusUpdateInfo?.status === 'مؤكد' ? 'تأكيد الحجز' : 'تأكيد الإلغاء'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}













