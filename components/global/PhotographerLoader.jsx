"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export function PhotographerLoader() {
    const containerVariants = {
        start: { transition: { staggerChildren: 0.1 } },
        end: { transition: { staggerChildren: 0.1 } },
    };

    const circleVariants = {
        start: { scale: 0, opacity: 0 },
        end: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "circOut",
                repeat: Infinity,
                repeatType: "mirror",
                repeatDelay: 0.5,
            },
        },
    };

    return (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-6">
            <motion.div 
                className="relative w-28 h-28 flex items-center justify-center"
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <motion.div variants={circleVariants} className="absolute w-full h-full border-2 border-primary/20 rounded-full" />
                <motion.div variants={circleVariants} transition={{ delay: 0.1 }} className="absolute w-2/3 h-2/3 border-2 border-primary/30 rounded-full" />
                <motion.div variants={circleVariants} transition={{ delay: 0.2 }} className="absolute w-1/3 h-1/3 border-2 border-primary/50 rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Camera className="w-8 h-8 text-primary" />
                </motion.div>
            </motion.div>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground tracking-widest text-sm"
            >
                جاري التحميل...
            </motion.p>
        </div>
    );
}
