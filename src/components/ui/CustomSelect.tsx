import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes you have a standard cn utility

export interface SelectOption {
    id: string;
    name: string;
    subtext?: string;
    icon?: React.ReactNode;
    color?: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    className?: string;
}

export const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
    ({ value, onChange, options, placeholder = 'Seleccionar...', disabled, onFocus, onBlur, className }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        // Keep local ref in sync with forwarded ref if needed, but here we just need containerRef for click outside
        const combinedRef = (node: HTMLDivElement) => {
            containerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement>).current = node;
        };

        const selectedOption = options.find((opt) => opt.id === value);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent | TouchEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                    onBlur?.();
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchstart', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
            };
        }, [isOpen, onBlur]);

        const handleToggle = () => {
            if (disabled) return;
            if (!isOpen) onFocus?.();
            setIsOpen(!isOpen);
        };

        const handleSelect = (optionId: string) => {
            if (disabled) return;
            onChange(optionId);
            setIsOpen(false);
            onBlur?.();
        };

        return (
            <div className={cn("relative w-full", className)} ref={combinedRef}>
                <motion.button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                    className={cn(
                        "w-full flex items-center justify-between text-left",
                        "bg-white/[0.03] text-white/90 border border-white/[0.08]",
                        "rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5",
                        "focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08]",
                        "transition-all text-[14px] sm:text-[15px] font-medium min-h-[48px]",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {selectedOption ? (
                            <>
                                {selectedOption.icon ? (
                                    <div className="flex-shrink-0 text-zinc-400">
                                        {selectedOption.icon}
                                    </div>
                                ) : selectedOption.color ? (
                                    <div
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: selectedOption.color }}
                                    />
                                ) : null}
                                <span className="truncate">{selectedOption.name}</span>
                                {selectedOption.subtext && (
                                    <span className="text-zinc-500 text-xs truncate">
                                        {selectedOption.subtext}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-zinc-500">{placeholder}</span>
                        )}
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex-shrink-0 ml-2"
                    >
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                    </motion.div>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="absolute z-50 w-full mt-2 origin-top"
                        >
                            <div className="overflow-hidden bg-zinc-900/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-black/[0.05]">
                                <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-1.5 flex flex-col gap-0.5 px-1.5">
                                    {options.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                                            No hay opciones
                                        </div>
                                    ) : (
                                        options.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleSelect(option.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl transition-colors",
                                                    value === option.id
                                                        ? "bg-white/[0.08] text-white"
                                                        : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    {option.icon ? (
                                                        <div className={cn(
                                                            "flex-shrink-0 transition-colors",
                                                            value === option.id ? "text-white" : "text-zinc-500"
                                                        )}>
                                                            {option.icon}
                                                        </div>
                                                    ) : option.color ? (
                                                        <div
                                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: option.color }}
                                                        />
                                                    ) : null}
                                                    <span className="truncate text-[14px] font-medium">
                                                        {option.name}
                                                    </span>
                                                    {option.subtext && (
                                                        <span className="text-zinc-500 text-[12px] truncate ml-1">
                                                            {option.subtext}
                                                        </span>
                                                    )}
                                                </div>
                                                {value === option.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="flex-shrink-0 ml-2 text-emerald-400"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

CustomSelect.displayName = 'CustomSelect';
