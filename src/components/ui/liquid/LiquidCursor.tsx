"use client";

"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function LiquidCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
            if (!isVisible) setIsVisible(true);
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("cursor-hover", handleHoverStart);
        window.addEventListener("cursor-leave", handleHoverEnd);

        // Also listen for native hover on interactive elements as a fallback
        const handleNativeHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, a, input, [role="button"]')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };
        window.addEventListener("mouseover", handleNativeHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("cursor-hover", handleHoverStart);
            window.removeEventListener("cursor-leave", handleHoverEnd);
            window.removeEventListener("mouseover", handleNativeHover);
        };
    }, [cursorX, cursorY, isVisible]);

    // Hide on mobile
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                opacity: isVisible ? 1 : 0,
            }}
        >
            {/* Core Dot */}
            <motion.div
                className="absolute inset-0 bg-white rounded-full"
                animate={{
                    scale: isHovering ? 2.5 : 0.5,
                    opacity: isHovering ? 0.1 : 1
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Ring */}
            <motion.div
                className="absolute inset-0 border border-white rounded-full"
                animate={{
                    scale: isHovering ? 1.5 : 0,
                    opacity: isHovering ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
}
