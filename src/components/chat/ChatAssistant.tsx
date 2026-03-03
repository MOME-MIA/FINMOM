"use client";
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { getDashboardKPIsAction, getTransactionsAction, getBudgetsAction, addRecordAction } from '@/app/actions';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMia } from './MiaContext';
import { MiaOrb } from '../login/MiaOrb';
import { SpendingWidget, SavingsWidget, AnomalyWidget } from './ChatWidgets';
import { insforge } from '@/lib/insforge';
interface Message {
    role: 'user' | 'model';
    content: string;
}

export const ChatAssistant: React.FC = () => {
    const { isOpen, setIsOpen } = useMia();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
    const [contextData, setContextData] = useState<any>(null);
    const [isFetchingContext, setIsFetchingContext] = useState(false);
    const [hasProactivelyNudged, setHasProactivelyNudged] = useState(false); // Ref 4: Track nudge state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Hydrate messages from sessionStorage
    useEffect(() => {
        const saved = sessionStorage.getItem('mia_chat_history');
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            setMessages([{ role: 'model', content: 'Soy M.I.A. (Momentum Intelligence Assistant). Mis sistemas están en línea y monitoreando tu base de datos.\n\n¿En qué te asisto hoy?' }]);
        }
        setIsHydrated(true);
    }, []);

    // Save messages to sessionStorage whenever they change
    useEffect(() => {
        if (isHydrated) {
            sessionStorage.setItem('mia_chat_history', JSON.stringify(messages));
        }
    }, [messages, isHydrated]);

    // Intelligent Route Commentary
    useEffect(() => {
        if (!isOpen) return;

        let msg = "";
        if (pathname === '/dashboard/analytics') {
            msg = "*Accediendo a la telemetría de Analítica Profunda. Aquí detectamos los micro-patrones de tu flujo de caja.*";
        } else if (pathname === '/dashboard/budgets') {
            msg = "*Monitor de Presupuestos. Ajustar los límites aquí es clave para mantener la fricción intencional de tus gastos.*";
        } else if (pathname === '/dashboard/settings/dna') {
            msg = "*Tu ADN Financiero. Asegurate de que tu perfil de riesgo y metas estén calibrados correctamente para mis proyecciones.*";
        } else if (pathname === '/dashboard/history') {
            msg = "*Historial central. Toda acción y flujo de capital queda registrado aquí de forma inmutable.*";
        } else if (pathname === '/dashboard/transactions') {
            msg = "*Gestor de transacciones. Recuerda que las eliminaciones tienen un retraso temporal de seguridad por protocolo.*";
        }

        if (msg) {
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.content === msg) return prev; // Avoid spamming the exact same message
                return [...prev, { role: 'model', content: msg }];
            });
            // Subtly trigger the speaking animation
            setAiState('speaking');
            setTimeout(() => setAiState('idle'), 3500);
        }
    }, [pathname, isOpen]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
                const x = (e.clientX / window.innerWidth - 0.5) * 15;
                const y = (e.clientY / window.innerHeight - 0.5) * 15;
                setMousePos({ x, y });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // InsForge Realtime (WebSockets) for Proactive Alerts
    useEffect(() => {
        let channelName = '';

        const setupRealtime = async () => {
            try {
                const { data: { user } } = await insforge.auth.getCurrentUser();
                if (!user) return;

                channelName = `user:${user.id}`;
                await insforge.realtime.connect();
                await insforge.realtime.subscribe(channelName);

                insforge.realtime.on('budget_alert', (payload: any) => {
                    // Abrir la ventana de M.I.A proactivamente
                    setIsOpen(true);
                    setMessages(prev => {
                        const newMsg = {
                            role: 'model' as const,
                            content: `⚠️ **[ALERTA DE SEGURIDAD PATRIMONIAL]**\n\n${payload.message || 'Presupuesto al límite'}.\n\nGasto detonante: $${payload.transaction_amount || 0}. Tu total mensual es de $${payload.total_expenses || 0} sobre un límite de $${payload.budget_limit || 0}.`
                        };
                        return [...prev, newMsg];
                    });
                    setAiState('speaking');
                    setTimeout(() => setAiState('idle'), 5000);
                });
            } catch (err) {
                console.error("MIA Realtime init error:", err);
            }
        };

        setupRealtime();

        return () => {
            if (channelName) {
                insforge.realtime.off('budget_alert', () => { });
                insforge.realtime.unsubscribe(channelName);
            }
        };
    }, [setIsOpen]);

    // Intelligent Route Hiding (No M.I.A on Auth flows)
    const hiddenRoutes = ['/login'];
    if (pathname && hiddenRoutes.includes(pathname)) return null;

    // Fetch context data when opened
    useEffect(() => {
        if (isOpen && !contextData) {
            fetchContext();
        }
    }, [isOpen]);

    const fetchContext = async () => {
        setIsFetchingContext(true);
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const [kpis, transactions, budgets] = await Promise.all([
                getDashboardKPIsAction(currentMonth),
                getTransactionsAction(currentMonth),
                getBudgetsAction()
            ]);

            const newContext = {
                kpis,
                transactions: transactions?.slice(0, 5) || [],
                budgets: budgets || []
            };
            setContextData(newContext);

            // Predict Nudge Logic: Evaluate Context Anomaly (e.g., Spent > 90% of income, or negative libre)
            if (newContext.kpis && !hasProactivelyNudged && isOpen) {
                const totalIncome = newContext.kpis.totalIncome || 0;
                const freeCash = newContext.kpis.netBalance || 0;

                if (totalIncome > 0 && freeCash < (totalIncome * 0.1)) {
                    // High risk state detected! Auto-initiate.
                    setHasProactivelyNudged(true);
                    autoInitiateNudge("He detectado que tu flujo de caja libre es inferior al 10% de tus ingresos. ¿Quieres que revise tus gastos recientes para identificar posibles recortes?");
                }
            }

        } catch (error) {
            console.error("Failed to fetch MIA context", error);
        } finally {
            setIsFetchingContext(false);
        }
    };

    const autoInitiateNudge = async (prompt: string) => {
        setLoading(true);
        setAiState('thinking');

        // We simulate sending a hidden prompt to the backend to get a properly formatted, contextualized proactive response from Gemini
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: `[NUDGE PREDICTIVO - SYSTEM OVERRIDE] Inicia la conversación con el usuario usando esta premisa: "${prompt}". Mantén tu personalidad Warm Authority, usa XAI markdown, no esperes que el usuario hable primero.` }],
                    context: contextData // Pass structured object
                })
            });

            const data = await response.json();

            setMessages(prev => {
                // Remove the default greeting if it's the only thing there
                const filtered = prev.length === 1 && prev[0].content.includes('monitoreando') ? [] : prev;
                return [...filtered, { role: 'model', content: data.response }];
            });

            setAiState('speaking');
            setTimeout(() => setAiState('idle'), 4000);

        } catch (error) {
            setAiState('idle');
        } finally {
            setLoading(false);
        }
    }

    const handleSend = async () => {
        if (!input.trim() || loading || isFetchingContext) return;

        const userMsg = input;
        setInput('');
        const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
        setMessages(newMessages);
        setLoading(true);
        setAiState('thinking'); // Transition to thinking state

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    context: contextData // Pass structured object directly
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 402) {
                    setMessages(prev => [...prev, {
                        role: 'model',
                        content: `**Límite de M.I.A Alcanzado**\n\n${data.message}\n\n[Ver Opciones de Mejora](/pricing)`
                    }]);
                    setAiState('idle');
                    setLoading(false);
                    return;
                }
                throw new Error("Error de red");
            }

            setAiState('speaking'); // Transition to speaking state upon receiving data

            let finalResponseText = data.response || '';

            // Autonomous Action Execution (Function Calling)
            if (data.functionCalls && data.functionCalls.length > 0) {
                for (const call of data.functionCalls) {
                    if (call.name === 'navigateTo') {
                        const { route } = call.args;
                        if (route) {
                            router.push(route);
                            // Ensure the user gets visual feedback of the autonomous action if the model didn't speak
                            if (!finalResponseText.trim()) {
                                finalResponseText = `*Redirigiendo espacio de trabajo a: \`${route}\`*`;
                            }
                        }
                    } else if (call.name === 'createTransaction') {
                        const { amountARS, amountUSD, type, category, description, date } = call.args;
                        try {
                            const result = await addRecordAction({
                                amountARS: Number(amountARS) || 0,
                                amountUSD: Number(amountUSD) || 0,
                                type: type as any,
                                category: category || 'General',
                                description: (description || 'Transacción') + ' [M.I.A.]',
                                date: date || new Date().toISOString().split('T')[0]
                            });

                            if (!finalResponseText.trim()) {
                                finalResponseText = `**Transacción Registrada con Éxito.**\n- **Monto:** $${amountARS} ARS\n- **Tipo:** ${type}\n- **Categoría:** ${category}`;
                            } else {
                                finalResponseText += `\n\n*(Sistemas de Fondo: Transacción por $${amountARS} registrada en la base de datos)*`;
                            }
                        } catch (e) {
                            console.error("Error creating transaction tools:", e);
                            finalResponseText = `*Precaución: Hubo un fallo en los sistemas al registrar la transacción. Proceda manualmente.*`;
                        }
                    }
                }
            }

            setMessages(prev => [...prev, { role: 'model', content: finalResponseText }]);

            // Revert to idle after "speaking" for a bit based on message length
            const speakingDuration = Math.min(Math.max(finalResponseText.length * 40, 2000), 8000);
            setTimeout(() => {
                setAiState('idle');
            }, speakingDuration);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', content: "Hubo una interferencia en mis sistemas. Intentá de nuevo." }]);
            setAiState('idle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* AI Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-[100px] right-4 md:bottom-28 md:right-8 w-[calc(100vw-32px)] md:w-[420px] max-h-[70vh] md:h-[600px] bg-black/50 backdrop-blur-[80px] rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/[0.08] flex flex-col z-40 overflow-hidden"
                    >
                        {/* Header: Pure Apple Minimalism */}
                        <div className="pt-8 pb-4 flex flex-col items-center justify-center shrink-0 border-b border-white/[0.04] relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-6 top-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-95"
                            >
                                <X size={18} />
                            </button>

                            <motion.div
                                className="relative flex items-center justify-center shrink-0 w-14 h-14"
                                animate={{ x: mousePos.x, y: mousePos.y }}
                                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                            >
                                <MiaOrb size={52} state={aiState as any} />
                            </motion.div>
                            <span className="mt-4 text-[10px] font-medium tracking-[0.2em] uppercase text-white/50">M.I.A.</span>
                        </div>

                        {/* Messages Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scroll-smooth no-scrollbar">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] px-5 py-3.5 text-[14.5px] leading-relaxed tracking-wide ${msg.role === 'user'
                                            ? 'bg-white text-black rounded-[24px] rounded-br-[8px] font-medium shadow-md'
                                            : 'bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-[24px] rounded-bl-[8px]'
                                            }`}>
                                            {msg.role === 'model' ? (
                                                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ children }) => (
                                                                <motion.p
                                                                    initial={{ filter: 'blur(8px)', opacity: 0, y: 5 }}
                                                                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                                    className="mb-4 last:mb-0 leading-relaxed"
                                                                >
                                                                    {children}
                                                                </motion.p>
                                                            ),
                                                            strong: ({ node, ...props }) => (
                                                                <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)] mx-0.5" {...props} />
                                                            ),
                                                            code: ({ node, className, children, ...props }: any) => {
                                                                const isInline = !String(children).includes('\n');
                                                                const contentString = String(children);

                                                                // Generative UI Interception
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                if (match && match[1] === 'widget') {
                                                                    try {
                                                                        const data = JSON.parse(contentString);
                                                                        if (data.type === 'spending') return <SpendingWidget data={data} />;
                                                                        if (data.type === 'savings') return <SavingsWidget data={data} />;
                                                                        if (data.type === 'anomaly') return <AnomalyWidget data={data} />;
                                                                    } catch (e) {
                                                                        console.error("Failed to parse widget JSON", e);
                                                                    }
                                                                }

                                                                return isInline ? (
                                                                    <code className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-white/10 mx-0.5" {...props}>
                                                                        {children}
                                                                    </code>
                                                                ) : (
                                                                    <pre className="bg-black/40 p-3 rounded-xl border border-white/10 overflow-x-auto text-[13px] my-2 font-mono text-white/80">
                                                                        <code {...props}>{children}</code>
                                                                    </pre>
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/[0.03] px-5 py-4 border border-white/[0.08] rounded-[24px] rounded-bl-[8px] flex items-center gap-1.5 h-[48px]">
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-1.5 h-1.5 bg-white/70 rounded-full"></motion.span>
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/70 rounded-full"></motion.span>
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/70 rounded-full"></motion.span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Apple Style Input Area */}
                        <div className="p-4 px-5 shrink-0 bg-transparent mb-2">
                            <div className="flex items-center gap-2 bg-white/[0.03] rounded-[24px] p-1.5 border border-white/[0.08] shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] backdrop-blur-md transition-all focus-within:border-white/20 focus-within:bg-white/[0.06]">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Consultar a M.I.A..."
                                    className="flex-1 bg-transparent border-0 px-4 py-2.5 text-[15px] focus:ring-0 text-white placeholder-white/30 font-medium outline-none"
                                    autoComplete="off"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim() || isFetchingContext}
                                    className="flex items-center justify-center size-[36px] bg-white text-black rounded-full hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all active:scale-95 shrink-0"
                                >
                                    <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
