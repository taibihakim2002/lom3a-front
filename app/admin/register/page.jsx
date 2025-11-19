// (هذا الملف يحتاج أن يكون 'use client' بسبب حركة الخلفية "motion")
'use client'; 

import AuthLayout from "@/features/auth/components/AuthLayout";
import RegisterPageWrapper from "@/features/auth/components/RegisterPageWrapper";
import { motion } from "framer-motion";

// (هذا الملف الآن مسؤول فقط عن الخلفية وتغليف المكون)
export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterPageWrapper />
    </AuthLayout>
  );
}