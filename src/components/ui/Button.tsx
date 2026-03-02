"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "btn-soft",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
                outline:
                    "border border-void-800 bg-transparent hover:bg-void-800 text-void-50",
                secondary:
                    "bg-lime-400 text-void-950 hover:bg-lime-500 shadow-lg font-bold",
                ghost: "hover:bg-void-800 text-void-200 hover:text-white",
                link: "text-violet-400 underline-offset-4 hover:underline",
                neon: "btn-neon",
            },
            size: {
                default: "h-12 px-5 py-2",
                sm: "h-10 rounded-md px-4",
                lg: "h-14 rounded-md px-8 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : motion.button;

        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props as any}
                />
            );
        }

        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                {...props as HTMLMotionProps<"button">}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
