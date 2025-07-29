"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MoreHorizontal, AlertCircle, Inbox, Trash2, CheckCircle, XCircle, Phone, MessageSquare, Mail, MapPin, Loader2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- الاستدعاءات الفعلية ---
import useApiRequest from "@/hooks/useApiRequest";
import globalApi from "@/utils/globalApi";
import { showToast } from "@/utils/showToast";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function BookingsPage() {
    const { request: fetchBookingsRequest, loading, error } = useApiRequest();
    const { request: updateBookingRequest, loading: isUpdating } = useApiRequest();
    const { request: deleteRequest, loading: isDeleting } = useApiRequest();

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [statusUpdateInfo, setStatusUpdateInfo] = useState(null); // { id, status }
    const [updateNotes, setUpdateNotes] = useState("");

    const fetchData = async (status) => {
        const params = status === 'all' ? {} : { status: status };
        const result = await fetchBookingsRequest(() => globalApi.getAllBookings(params));
        if (result.success && result.data.data) {
            setBookings(result.data.data);
        }
    };

    useEffect(() => {
        const statusMap = {
            pending: "بانتظار التأكيد",
            confirmed: "مؤكد",
            canceled: "ملغي",
            complete: "مكتمل",
            all: "all"
        };
        fetchData(statusMap[activeTab]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleUpdateStatus = async () => { // <-- دالة لتحديث الحالة مع الملاحظات
        if (!statusUpdateInfo) return;
        
        const { id, status } = statusUpdateInfo;
        const payload = { 
            status,
            confirmationNotes: status === 'مؤكد' ? updateNotes : '',
            rejectionReason: status === 'ملغي' ? updateNotes : ''
        };

        const result = await updateBookingRequest(() => globalApi.updateBookingStatus(id, payload));
        if (result.success) {
            showToast("success", "تم تحديث حالة الحجز بنجاح");
            setBookings(prev => prev.map(b => b._id === id ? { ...b, ...payload } : b));
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
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        } else {
            showToast("error", result.error || "فشل تحديث الحالة");
        }
    };
    const handleDeleteBooking = async () => {
        if (!bookingToDelete) return;
        const result = await deleteRequest(() => globalApi.deleteBooking(bookingToDelete));
        if (result.success) {
            showToast("success", "تم حذف الحجز بنجاح");
            setBookings(prev => prev.filter(b => b._id !== bookingToDelete));
            setBookingToDelete(null);
        } else {
            showToast("error", result.error || "فشل حذف الحجز");
        }
    };
 const openStatusUpdateDialog = (booking, newStatus) => { // <-- دالة لفتح نافذة الملاحظات
        setSelectedBooking(null);
        setStatusUpdateInfo({ id: booking._id, status: newStatus });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Table dir="rtl">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">العميل</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">الخدمة</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">رقم الهاتف</TableHead>
                            <TableHead className="hidden md:table-cell text-right">التاريخ والوقت</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-left"><span className="sr-only">الإجراءات</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div></TableCell>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell className="text-left"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        if (error) {
            return (
                <div className="text-center py-24 text-destructive">
                    <AlertCircle className="mx-auto h-16 w-16 mb-4" />
                    <h3 className="text-2xl font-bold">حدث خطأ ما</h3>
                    <p className="mb-6">{error}</p>
                    <Button variant="secondary" onClick={() => fetchData(activeTab)}>إعادة المحاولة</Button>
                </div>
            );
        }
        if (!bookings || bookings.length === 0) {
            return (
                <div className="text-center py-24">
                    <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold">لا توجد حجوزات في هذا القسم</h3>
                </div>
            );
        }
        return (
            <Table dir="rtl">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="hidden sm:table-cell text-right">الخدمة</TableHead>
                        <TableHead className="hidden sm:table-cell text-right">رقم الهاتف</TableHead>
                        <TableHead className="hidden md:table-cell text-right">التاريخ والوقت</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-left"><span className="sr-only">الإجراءات</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking._id} >
                            <TableCell onClick={() => setSelectedBooking(booking)} className="cursor-pointer">
                                <div className="font-medium">{booking.name}</div>
                                <div className="text-sm text-muted-foreground hidden sm:block">{booking.email}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell" onClick={() => setSelectedBooking(booking)}>{booking.service}</TableCell>

                            <TableCell className="hidden sm:table-cell" onClick={() => setSelectedBooking(booking)}>{booking.phone}</TableCell>
                            <TableCell className="hidden md:table-cell" onClick={() => setSelectedBooking(booking)}>
                                {new Date(booking.bookingDate).toLocaleDateString('en-us')} - {booking.bookingTime}
                            </TableCell>
                            <TableCell onClick={() => setSelectedBooking(booking)}>
                                <Badge variant={booking.status === 'مؤكد' ? 'default' : booking.status === 'ملغي' ? 'destructive' : 'secondary'}>
                                    {booking.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-left">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="text-start" dir="rtl" onClick={() => setSelectedBooking(booking)}><Eye className="ml-2 h-4 w-4" /> عرض التفاصيل</DropdownMenuItem>
                                        <DropdownMenuSub className="text-start">
                                            <DropdownMenuSubTrigger dir="rtl" className="text-start">تغيير الحالة</DropdownMenuSubTrigger>
                                             <DropdownMenuSubContent className="text-start" dir="rtl">
                                                {/* --- START: تم التعديل هنا --- */}
                                                <DropdownMenuItem onClick={() => openStatusUpdateDialog(booking, 'مؤكد')}>مؤكد</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openStatusUpdateDialog(booking, 'ملغي')}>ملغي</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDirectUpdateStatus(booking._id, 'مكتمل')}>مكتمل</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDirectUpdateStatus(booking._id, 'بانتظار التأكيد')}>بانتظار التأكيد</DropdownMenuItem>
                                                {/* --- END: تم التعديل هنا --- */}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem dir="rtl" className="text-destructive" onClick={() => setBookingToDelete(booking._id)}><Trash2 className="ml-2 h-4 w-4" /> حذف</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <>
            <motion.div
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold font-display">الحجوزات</h1>
                    <p className="text-muted-foreground">إدارة جميع طلبات الحجز الواردة.</p>
                </div>
                
                <Tabs defaultValue="all" dir="rtl" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList>
                        <TabsTrigger value="all">الكل</TabsTrigger>
                        <TabsTrigger value="pending">بانتظار التأكيد</TabsTrigger>
                        <TabsTrigger value="confirmed">مؤكد</TabsTrigger>
                        <TabsTrigger value="canceled">ملغي</TabsTrigger>
                        <TabsTrigger value="complete">مكتمل</TabsTrigger>
                    </TabsList>
                    <Card className="mt-4">
                        <CardContent className="p-0">
                            <TabsContent value={activeTab} className="m-0">{renderContent()}</TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </motion.div>

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
