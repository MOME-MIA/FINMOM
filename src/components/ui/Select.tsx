"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    label: string;
    setLabel: (label: string) => void;
} | null>(null);

export const Select = ({ children, onValueChange, defaultValue }: any) => {
    const [value, setValue] = React.useState(defaultValue || "");
    const [open, setOpen] = React.useState(false);
    const [label, setLabel] = React.useState("");

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        if (onValueChange) onValueChange(newValue);
    };

    return (
        <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen, label, setLabel }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = ({ children, className }: any) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within Select");

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                "flex h-14 w-full items-center justify-between rounded-[20px] border border-white/10 bg-black/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-black/40 focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/20 transition-all",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 text-white/50" />
        </button>
    );
};

export const SelectValue = ({ placeholder }: any) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within Select");

    return (
        <span className="block truncate">
            {context.value ? (context.label || context.value) : placeholder}
        </span>
    );
};

export const SelectContent = ({ children, className }: any) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectContent must be used within Select");

    return (
        <AnimatePresence>
            {context.open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => context.setOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            "absolute z-50 min-w-[8rem] overflow-hidden rounded-[24px] border border-white/10 bg-[#111111]/80 backdrop-blur-xl text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in-80 w-full mt-2",
                            className
                        )}
                    >
                        <div className="p-1">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const SelectItem = ({ children, value, className }: any) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectItem must be used within Select");

    const isSelected = context.value === value;

    // Update label if selected
    React.useEffect(() => {
        if (isSelected) {
            context.setLabel(children?.toString() || value);
        }
    }, [isSelected, children, value, context]);

    return (
        <button
            type="button"
            onClick={() => {
                context.onValueChange(value);
                context.setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-[16px] py-3 pl-10 pr-4 text-sm outline-none focus:bg-white/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-white/10 transition-colors text-left text-white/70 hover:text-white",
                className
            )}
        >
            <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                {isSelected && <Check className="h-4 w-4 text-white" />}
            </span>
            <span className="truncate">{children}</span>
        </button>
    );
};
