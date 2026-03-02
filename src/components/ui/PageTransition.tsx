"use client";

import { motion } from "framer-motion";

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)", y: -10 }}
            transition={{
                duration: 0.15,
                ease: "easeOut",
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}
