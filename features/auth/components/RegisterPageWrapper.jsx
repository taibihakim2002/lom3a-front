'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// --- التعديل هنا: إعادة "Loader2" ---
import { Loader2 } from 'lucide-react'; 
import { useEffect } from 'react';
import { toast } from 'sonner'; 
import { authApi } from '../api';
import RegisterForm from './RegisterForm'; 

export default function RegisterPageWrapper() {
  const router = useRouter();

  // 1. التحقق من حالة التسجيل
  const { data: authStatus, isLoading: isLoadingStatus, isError } = useQuery({
    queryKey: ['authStatus'],
    queryFn: authApi.checkAuthStatus,
    retry: 1, 
    refetchOnWindowFocus: false,
  });

  // 2. إعادة التوجيه
  useEffect(() => {
    if (isLoadingStatus) return; // (انتظر انتهاء التحميل)

    if (authStatus?.adminExists === true) {
      router.replace('/admin/login'); // (إعادة توجيه فورية)
    }
    
    if (isError) {
      toast.error('فشل الاتصال بالخادم. لا يمكن التحقق من حالة التسجيل.');
      
    }

  }, [authStatus, isLoadingStatus, isError, router]);

  // 3. --- التعديل هنا ---
  // (إظهار السبينر أثناء التحميل أو قبل إعادة التوجيه)
  if (isLoadingStatus || authStatus?.adminExists === true) {
    return (
      <div className="flex flex-col items-center justify-center z-30">
        {/* (استخدام "text-primary-foreground" ليظهر فوق الخلفية الملونة) */}
        <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" /> 
        
      </div>
    );
  }
  
  // 4. إذا لم يكن التحميل جارياً والحساب غير موجود، اعرض الفورم
  return <RegisterForm />;
}