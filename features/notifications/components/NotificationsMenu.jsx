'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Clock, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsMenu() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // جلب الإشعارات
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll,
    refetchInterval: 15000, // تحديث كل 15 ثانية
  });

  // جلب العدد غير المقروء
  const { data: countData } = useQuery({
    queryKey: ['notificationsCount'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 15000,
  });

  const notifications = data?.data?.data?.notifications || [];
  const unreadCount = countData?.data?.count || 0;

  // دالة تحديد الكل كمقروء
  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      toast.success("تم تحديد الكل كمقروء");
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notificationsCount']);
      // (اختياري: إبقاء القائمة مفتوحة أو إغلاقها)
    },
  });

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'الآن';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <DropdownMenu dir="rtl" open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground relative transition-colors duration-200 hover:bg-secondary/80">
            <Bell className="h-5 w-5" />
            <span className="sr-only">التنبيهات</span>
            
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-2 right-2 flex h-2.5 w-2.5"
                >
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive border-2 border-background"></span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0 border border-border/60 shadow-2xl bg-background/95 backdrop-blur-md rounded-xl text-right" sideOffset={8}>
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-secondary/30">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-foreground text-base">الإشعارات</h4>
            {unreadCount > 0 && (
              <Badge variant="default" className="px-2 py-0.5 h-5 text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                {unreadCount} جديد
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10 px-3 transition-colors rounded-full"
                onClick={() => markReadMutation.mutate()}
                disabled={markReadMutation.isPending}
            >
                <CheckCheck className="w-3.5 h-3.5 ml-1.5" />
                قراءة الكل
            </Button>
          )}
        </div>

        <ScrollArea className="h-[380px]" dir="rtl">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                جاري التحميل...
             </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col py-1">
              {notifications.map((item) => (
                <DropdownMenuItem key={item._id} asChild className="cursor-pointer p-0 focus:bg-transparent">
                  <Link 
                    href="/admin/dashboard/bookings" 
                    // --- التعديل: تغيير الخلفية إذا كان غير مقروء ---
                    className={`group flex items-start gap-4 px-5 py-4 transition-all duration-200 border-b border-border/30 last:border-0 relative overflow-hidden text-right
                      ${!item.isRead ? 'bg-primary/5' : 'hover:bg-secondary/40'}
                    `}
                  >
                    {/* الشريط الجانبي للأزرق (يظهر فقط لغير المقروء) */}
                    {!item.isRead && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
                    )}

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${!item.isRead ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      <Inbox className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-semibold leading-none ${!item.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.type === 'new_booking' ? 'طلب حجز جديد' : 'إشعار'}
                        </p>
                        {/* النقطة الزرقاء */}
                        {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/50"></span>}
                      </div>
                      
                      <p className={`text-sm line-clamp-2 leading-snug ${!item.isRead ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                        {item.message}
                      </p>
                      
                      <div className="flex items-center pt-1 text-xs text-muted-foreground/80 font-medium">
                        <Clock className="ml-1.5 h-3.5 w-3.5" />
                        {timeAgo(item.createdAt)}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-center p-6">
              <div className="bg-secondary/50 p-4 rounded-full mb-4 ring-1 ring-border/50">
                 <Bell className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <p className="text-base font-semibold text-foreground">لا توجد إشعارات</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-border/60 bg-secondary/30 rounded-b-xl">
            <Button variant="outline" className="w-full text-sm h-9 font-medium hover:bg-background hover:text-primary hover:border-primary/30 transition-all" asChild>
                <Link href="/admin/dashboard/bookings">
                  عرض كافة الطلبات
                </Link>
            </Button>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}