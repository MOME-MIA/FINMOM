"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { Search, Loader2, Calendar, Tag, X } from "lucide-react";
import { searchTransactionsAction } from "@/app/actions";
import { Transaction } from "@/types/finance";
import { motion, AnimatePresence } from "framer-motion";

interface SearchContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}

export function SearchProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (query.length > 2) {
            setLoading(true);
            const timer = setTimeout(() => {
                searchTransactionsAction(query).then((res) => {
                    setResults(res);
                    setLoading(false);
                });
            }, 500); // Debounce
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <SearchContext.Provider value={{ open, setOpen }}>
            {children}
            <AnimatePresence>
                {open && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 shadow-2xl overflow-y-auto backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-xl my-auto bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-[101]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center border-b border-white/10 px-4 py-4">
                                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                                <input
                                    className="flex-1 bg-transparent outline-none text-xl placeholder:text-muted-foreground/50 text-white font-light"
                                    placeholder="Buscar..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {results.length === 0 && query.length > 2 && !loading && (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        No se encontraron resultados.
                                    </div>
                                )}

                                {query.length <= 2 && (
                                    <div className="text-center py-12 text-muted-foreground/40 text-sm font-light">
                                        Escribe para buscar transacciones...
                                    </div>
                                )}

                                <div className="space-y-1">
                                    {results.map((item, index) => (
                                        <motion.div
                                            layout
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-10px" }}
                                            transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#007AFF]/20 transition-colors group cursor-default"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-white group-hover:text-white transition-colors">{item.description || item.categoryName || 'Sin categoría'}</span>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground group-hover:text-white/70 mt-0.5">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                                                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {item.categoryName || 'Sin categoría'}</span>
                                                </div>
                                            </div>
                                            <div className="font-semibold text-sm text-white">
                                                ${item.amount.toLocaleString()}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {results.length > 0 && (
                                <div className="bg-white/5 px-4 py-2 text-[10px] text-muted-foreground flex justify-between items-center border-t border-white/5">
                                    <span>{results.length} resultados encontrados</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </SearchContext.Provider>
    );
}
