import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/app/contexts/ProfileProvider";

export default function Header() {
    const { profile, isLoading } = useProfile(); // 2. استدعاء الـ Hook للحصول على البيانات

  const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => { setScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المشاريع", href: "/projects" },
  { label: "من أنا", href: "/about" },
  { label: "الخدمات", href: "/services" },
  { label: "اتصل بي", href: "/contact" },
];

    return (
        <motion.header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/80 backdrop-blur-sm border-b border-border" : "bg-transparent")} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <div className="container mx-auto flex items-center justify-between h-20 px-4">
                <div className="flex items-center gap-2"> <Camera className="h-6 w-6 text-primary" /> <span className="font-display text-xl font-bold">{profile?.name} </span> </div>
                <nav className="hidden md:flex items-center gap-8"> {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="text-muted-foreground hover:text-primary transition-colors duration-300"
    >
      {link.label}
    </Link>
  ))}</nav>
                <Link href="/book"><Button>احجز الآن<ArrowLeft className="mr-2 h-4 w-4" /></Button></Link>
            </div>
        </motion.header>
    );
}
