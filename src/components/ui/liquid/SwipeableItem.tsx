"use client";

import { motion, PanInfo, useAnimation } from "framer-motion";
import { Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete?: () => void;
    onEdit?: () => void;
    className?: string;
}

export function SwipeableItem({ children, onDelete, onEdit, className }: SwipeableItemProps) {
    const controls = useAnimation();
    const [dragStart, setDragStart] = useState({ x: 0 });

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -100 || velocity < -500) {
            // Swiped left (Delete)
            if (onDelete) {
                await controls.start({ x: -200, opacity: 0 });
                onDelete();
                controls.set({ x: 0, opacity: 1 }); // Reset for next item or if delete is cancelled
            } else {
                controls.start({ x: 0 });
            }
        } else if (offset > 100 || velocity > 500) {
            // Swiped right (Edit)
            if (onEdit) {
                onEdit();
                controls.start({ x: 0 });
            } else {
                controls.start({ x: 0 });
            }
        } else {
            // Reset
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Background Actions */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                {/* Edit Action (Left) */}
                <div className="bg-blue-500/20 w-1/2 h-full flex items-center justify-start pl-6">
                    <Edit2 className="text-blue-400 h-5 w-5" />
                </div>
                {/* Delete Action (Right) */}
                <div className="bg-red-500/20 w-1/2 h-full flex items-center justify-end pr-6">
                    <Trash2 className="text-red-400 h-5 w-5" />
                </div>
            </div>

            {/* Foreground Content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragStart={(e, info) => setDragStart({ x: info.point.x })}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative bg-black/40 backdrop-blur-md border-b border-white/5 last:border-0 z-10"
                whileTap={{ cursor: "grabbing" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
