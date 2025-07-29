import { toast } from "sonner";

export function showToast(type, title, description) {
  const isSuccess = type === "success";

  toast(title, {
    description: description || "",
    style: {
      backgroundColor: isSuccess ? "#16a34a" : "#dc2626",       // أخضر أو أحمر
      color: "#ffffff",                                         // نص أبيض
      border: `1px solid ${isSuccess ? "#15803d" : "#b91c1c"}`, // حدود أغمق
      zIndex: 9999,
      position: "relative",
            fontFamily: "Tajawal, sans-serif", //  <-- ✨ أضف هذا السطر

    },
    
  });
}
