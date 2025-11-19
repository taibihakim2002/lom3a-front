'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { authApi } from '../api';
import LoginForm from './LoginForm'; 
import { Toaster, toast } from 'sonner'; 

export default function LoginPageWrapper() {
  const router = useRouter();

  // 1. التحقق مما إذا كان المستخدم مسجل دخوله بالفعل
  const { data: userProfile, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['myProfile'], 
    queryFn: authApi.getMyProfile, 
    retry: 1, 
    refetchOnWindowFocus: false,
  });

  // 2. إعادة التوجيه
  useEffect(() => {
    // (إذا نجح جلب البيانات = المستخدم مسجل دخوله)
    if (isSuccess && userProfile) {
      router.replace('/admin/dashboard'); // (إعادة توجيه فورية للوحة التحكم)
    }
    
  }, [userProfile, isSuccess, router]);


  if (isLoading || isSuccess) {
    return (
      <>
        <Toaster richColors position="top-right" /> 
        <div className="flex flex-col items-center justify-center z-30">
          <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" /> 
        </div>
      </>
    );
  }
  
  return <LoginForm />;
}