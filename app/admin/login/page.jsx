'use client'; 

// (استيراد المكون المغلف للفورم)
import LoginPageWrapper from "@/features/auth/components/LoginPageWrapper";
// (استيراد التخطيط المشترك الجديد)
import AuthLayout from "@/features/auth/components/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginPageWrapper />
    </AuthLayout>
  );
}