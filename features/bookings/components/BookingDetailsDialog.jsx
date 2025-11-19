'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, 
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  User, Phone, Calendar, Clock, MapPin, Briefcase, FileText, 
  CheckCircle, XCircle, Trash2, Loader2 
} from "lucide-react";

export default function BookingDetailsDialog({ 
  booking, 
  open, 
  onOpenChange,
  onConfirm, 
  onCancel,  
  onDelete,  
  isProcessing 
}) {
  if (!booking) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-primary/20 text-primary';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'جديد';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* --- التعديل 1: ضبط الارتفاع والتخطيط للموبايل ---
        max-h-[90vh]: أقصى ارتفاع 90% من الشاشة
        flex flex-col: لترتيب الهيدر والمحتوى والفوتر عمودياً
        overflow-hidden: لمنع ظهور سكرول خارجي
      */}
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col bg-background p-0 gap-0 overflow-hidden" dir="rtl">
        
        {/* --- الهيدر (ثابت) --- */}
        <DialogHeader className="text-right p-6 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            تفاصيل الحجز
            <Badge className={`text-xs px-2 py-0.5 hover:bg-opacity-80 border-0 ${getStatusColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            رقم الحجز: <span className="font-mono text-xs">{booking._id || booking.id}</span>
          </DialogDescription>
        </DialogHeader>

        {/* --- المحتوى (قابل للتمرير - Scrollable) --- */}
        {/* overflow-y-auto: يسمح بالتمرير للمحتوى فقط */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 text-right">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* معلومات العميل */}
               <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <User size={16} /> العميل
                  </h4>
                  <div className="space-y-1">
                      <p className="font-medium text-foreground text-lg">{booking.name}</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">{booking.phone}</p>
                  </div>
               </div>

               {/* الموعد */}
               <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Calendar size={16} /> الموعد
                  </h4>
                  <div className="space-y-1">
                      <p className="font-medium text-foreground">{booking.date}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={14} /> {booking.time}
                      </div>
                  </div>
               </div>
            </div>

            {/* التفاصيل والموقع */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5"><Briefcase size={18} className="text-primary" /></div>
                <div>
                    <span className="text-xs text-muted-foreground block">الخدمة المطلوبة</span>
                    <span className="text-foreground font-medium">{booking.service}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5"><MapPin size={18} className="text-primary" /></div>
                <div>
                    <span className="text-xs text-muted-foreground block">العنوان</span>
                    <p className="text-foreground text-sm leading-relaxed">{booking.address}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full mt-0.5"><FileText size={18} className="text-yellow-600" /></div>
                  <div className="w-full">
                      <span className="text-xs text-muted-foreground block mb-1">ملاحظات</span>
                      <p className="text-foreground text-sm leading-relaxed bg-yellow-50 p-3 rounded-md border border-yellow-100 w-full">
                      {booking.notes}
                      </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- الفوتر / الأزرار (ثابت في الأسفل) --- */}
        <DialogFooter className="p-6 border-t bg-background flex flex-col sm:flex-row gap-3 sm:justify-between">
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-2 sm:order-1">
                {/* زر الحذف */}
                <Button 
                    variant="destructive" 
                    onClick={() => onDelete(booking._id || booking.id)}
                    disabled={isProcessing}
                    className="w-full sm:w-auto"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    حذف
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
                 {/* زر التأكيد */}
                {booking.status === 'pending' && (
                    <Button 
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onConfirm(booking._id || booking.id)}
                        disabled={isProcessing}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تأكيد الطلب
                    </Button>
                )}

                 {/* زر الرفض */}
                {booking.status !== 'cancelled' && (
                    <Button 
                        variant="secondary" 
                        onClick={() => onCancel(booking._id || booking.id)}
                        disabled={isProcessing}
                        className="w-full sm:w-auto text-destructive hover:text-destructive border border-destructive/20"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                    </Button>
                )}

                 {/* زر الإغلاق */}
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">إغلاق</Button>
                </DialogClose>
            </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}