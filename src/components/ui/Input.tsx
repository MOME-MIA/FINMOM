import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-14 w-full rounded-[20px] border border-white/10 bg-black/20 px-4 py-2 text-sm text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/50",
                    "focus-visible:outline-none focus-visible:bg-black/40 focus-visible:border-white/30 focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                    "disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/20",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
