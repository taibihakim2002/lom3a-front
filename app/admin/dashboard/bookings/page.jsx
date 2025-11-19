'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MoreHorizontal, CheckCircle, Trash2, Clock, MapPin, MessageSquare, Loader2, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/features/bookings/api';
import { toast } from 'sonner';
import BookingDetailsDialog from '@/features/bookings/components/BookingDetailsDialog';

export default function BookingsPage() {
  const queryClient = useQueryClient();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. جلب البيانات
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAll,
  });

  const bookings = data?.data?.data?.bookings || [];

  // --- Mutations (العمليات) ---

  // أ) تحديث الحالة (تأكيد أو إلغاء)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingsApi.updateStatus({ id, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['bookings']);
      const msg = variables.status === 'confirmed' ? "تم تأكيد الحجز." : "تم رفض/إلغاء الحجز.";
      toast.success(msg);
      setIsDialogOpen(false); // إغلاق المودال بعد النجاح
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث."),
  });

  // ب) حذف الحجز
  const deleteMutation = useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success("تم حذف الحجز.");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف."),
  });

  // متغير للتحقق من أي عملية جارية لتعطيل الأزرار
  const isProcessing = updateStatusMutation.isPending || deleteMutation.isPending;

  // --- دوال التعامل مع الأحداث (Handlers) ---

  const handleConfirm = (id) => {
    updateStatusMutation.mutate({ id, status: 'confirmed' });
  };

  const handleCancel = (id) => {
    if(confirm('هل أنت متأكد من رفض/إلغاء هذا الطلب؟')) {
        updateStatusMutation.mutate({ id, status: 'cancelled' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('تحذير: سيتم حذف هذا الطلب نهائياً. هل أنت متأكد؟')) {
        deleteMutation.mutate(id);
    }
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  // (باقي دوال التنسيق)
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'جديد';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'confirmed': return 'bg-primary/20 text-primary hover:bg-primary/20';
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled': return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
      default: return 'bg-secondary';
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  if (isError) return <div className="text-center text-red-500 p-10">فشل تحميل البيانات.</div>;

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className="flex items-center justify-between text-right">
        <div>
          <h1 className="text-3xl font-bold text-foreground">طلبات الحجز</h1>
          <p className="text-muted-foreground">إدارة وتأكيد طلبات الحجز الواردة.</p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader className="text-right">
          <CardTitle>جميع الطلبات ({bookings.length})</CardTitle>
          <CardDescription>آخر الطلبات الواردة من الموقع.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[20%]">العميل</TableHead>
                <TableHead className="text-right w-[20%]">الخدمة</TableHead>
                <TableHead className="text-right w-[25%] hidden md:table-cell">الموعد</TableHead>
                <TableHead className="text-right w-[25%] hidden lg:table-cell">العنوان والملاحظات</TableHead>
                <TableHead className="text-right w-[10%]">الحالة</TableHead>
                <TableHead className="text-center w-[5%]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    لا توجد طلبات حالياً.
                  </TableCell>
                </TableRow>
              )}
              {bookings.map((booking) => (
                <TableRow 
                  key={booking._id || booking.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleRowClick(booking)}
                >
                  {/* العميل */}
                  <TableCell className="font-medium text-right">
                    <div className="font-bold">{booking.name}</div>
                    <div className="text-xs text-muted-foreground" dir="ltr">{booking.phone}</div>
                  </TableCell>
                  
                  {/* الخدمة */}
                  <TableCell className="text-right">{booking.service}</TableCell>
                  
                  {/* الموعد */}
                  <TableCell className="hidden md:table-cell text-right text-sm">
                    <div>{booking.date}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-start gap-1 mt-1">
                      <span>{booking.time}</span>
                      <Clock size={12} />
                    </div>
                  </TableCell>

                  {/* العنوان والملاحظات */}
                  <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                    <div className="flex items-center justify-start gap-1">
                      <span className="truncate max-w-[150px]" title={booking.address}>{booking.address}</span>
                      <MapPin size={12} />
                    </div>
                    {booking.notes && (
                      <div className="flex items-center justify-start gap-1 mt-1 text-xs text-amber-600">
                        <span className="truncate max-w-[150px]">{booking.notes}</span>
                        <MessageSquare size={12} />
                      </div>
                    )}
                  </TableCell>
                  
                  {/* الحالة */}
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline"
                      className={`border-0 ${getStatusColor(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </TableCell>

                  {/* إجراءات (القائمة المنسدلة) */}
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {booking.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleConfirm(booking._id || booking.id)}>
                              <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                              تأكيد الطلب
                            </DropdownMenuItem>
                        )}
                        {booking.status !== 'cancelled' && (
                            <DropdownMenuItem onClick={() => handleCancel(booking._id || booking.id)}>
                              <XCircle className="ml-2 h-4 w-4 text-orange-500" />
                              رفض/إلغاء
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(booking._id || booking.id)}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف الطلب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- التعديل هنا: تمرير الدوال الناقصة للمودال --- */}
      <BookingDetailsDialog 
        booking={selectedBooking} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onConfirm={handleConfirm} // تمرير دالة التأكيد
        onCancel={handleCancel}   // تمرير دالة الرفض
        onDelete={handleDelete}   // تمرير دالة الحذف
        isProcessing={isProcessing} // تمرير حالة التحميل
      />

    </motion.div>
  );
}