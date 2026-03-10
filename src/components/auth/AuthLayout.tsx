"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MiaOrb } from "@/components/login/MiaOrb";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface TrustBadge {
    icon: ReactNode;
    text: string;
}

interface AuthLayoutProps {
    children: ReactNode;
    leftPanel: ReactNode;
    theme: {
        primaryGlow: string;
        secondaryGlow: string;
        selectionColor: string;
        accentGlow?: string;
    };
    headerLink: { href: string; label: string };
    mobileTitle: string;
    mobileSubtitle: string;
    trustBadges?: TrustBadge[];
    securityNote?: ReactNode;
    orbState?: "idle" | "thinking" | "success" | "error" | "speaking";
}

// ──────────────────────────────────────────────
// Hook: detect if device is mobile (< 1024px)
// ──────────────────────────────────────────────
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

// ──────────────────────────────────────────────
// Floating Particle Field — DESKTOP ONLY
// Canvas animation is too heavy for mobile GPUs
// ──────────────────────────────────────────────
function ParticleField({ color }: { color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; alphaDir: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.25,
                alphaDir: (Math.random() - 0.5) * 0.004,
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha += p.alphaDir;
                if (p.alpha <= 0.05 || p.alpha >= 0.3) p.alphaDir *= -1;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color.replace(")", `, ${p.alpha})`).replace("rgb(", "rgba(");
                ctx.fill();
            });

            // Connections — only between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = color.replace(")", `, ${0.035 * (1 - dist / 100)})`).replace("rgb(", "rgba(");
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, [color]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />;
}

// ──────────────────────────────────────────────
// Animated Grid Lines — DESKTOP ONLY
// ──────────────────────────────────────────────
function AnimatedGrid() {
    return (
        <div className="absolute inset-0 pointer-events-none z-[0] overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`h${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.025, 0] }}
                    transition={{ duration: 8, delay: i * 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-[1px]"
                    style={{
                        top: `${18 + i * 16}%`,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                    }}
                />
            ))}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`v${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.02, 0] }}
                    transition={{ duration: 10, delay: i * 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-[1px]"
                    style={{
                        left: `${25 + i * 25}%`,
                        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent)",
                    }}
                />
            ))}
        </div>
    );
}

export function AuthLayout({
    children,
    leftPanel,
    theme,
    headerLink,
    mobileTitle,
    mobileSubtitle,
    trustBadges,
    securityNote,
    orbState = "idle",
}: AuthLayoutProps) {
    const isMobile = useIsMobile();

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <main className="relative w-full min-h-screen overflow-hidden bg-[#030304] text-white font-sans">

            {/* ─── Ambient Background ─── */}
            {/* Mobile: 2 static glows (no animation = no flicker) */}
            {/* Desktop: 4 animated glows with breathing */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Primary glow */}
                {isMobile ? (
                    // Mobile: static glow, GPU-friendly with transform
                    <div
                        className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
                        style={{ backgroundColor: theme.primaryGlow, transform: "translateZ(0)" }}
                    />
                ) : (
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-25%] left-[-15%] w-[700px] h-[700px] rounded-full blur-[180px]"
                        style={{ backgroundColor: theme.primaryGlow }}
                    />
                )}

                {/* Secondary glow */}
                {isMobile ? (
                    <div
                        className="absolute bottom-[-15%] right-[-10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.06]"
                        style={{ backgroundColor: theme.secondaryGlow, transform: "translateZ(0)" }}
                    />
                ) : (
                    <motion.div
                        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.04, 0.09, 0.04] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-25%] right-[-15%] w-[600px] h-[600px] rounded-full blur-[150px]"
                        style={{ backgroundColor: theme.secondaryGlow }}
                    />
                )}

                {/* Desktop-only extra glows */}
                {!isMobile && (
                    <>
                        <motion.div
                            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.0, 0.05, 0.0] }}
                            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                            className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[220px]"
                            style={{ backgroundColor: theme.accentGlow || theme.primaryGlow }}
                        />
                        <motion.div
                            animate={{ opacity: [0.02, 0.06, 0.02] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                            className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] rounded-full blur-[120px]"
                            style={{ backgroundColor: theme.secondaryGlow }}
                        />
                    </>
                )}
            </div>

            {/* Desktop-only effects */}
            {!isMobile && (
                <>
                    <AnimatedGrid />
                    <ParticleField color={hexToRgb(theme.primaryGlow)} />
                </>
            )}

            {/* Grain Overlay — lighter on mobile */}
            <div className={`fixed inset-0 bg-noise pointer-events-none z-[2] mix-blend-overlay ${isMobile ? "opacity-[0.01]" : "opacity-[0.02]"}`} />

            {/* ─── Top Navbar ─── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-6 md:px-10 py-4 sm:py-5"
            >
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        <img src="/logos/finmom-logo.svg" alt="FINMOM" className="w-full h-full object-contain pointer-events-none select-none" />
                    </div>
                    <span className="font-bold text-[13px] sm:text-[14px] text-white/50 group-hover:text-white/70 transition-colors tracking-wide">FINMOM</span>
                </Link>
                <Link
                    href={headerLink.href}
                    className="text-[11px] sm:text-[12px] text-white/40 hover:text-white/70 transition-all duration-300 font-semibold tracking-wider uppercase border border-white/[0.06] hover:border-white/[0.12] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/[0.03]"
                >
                    {headerLink.label}
                </Link>
            </motion.header>

            {/* ─── Main Layout ─── */}
            <div className="relative z-20 w-full min-h-screen flex flex-col lg:flex-row">

                {/* Left Panel — Desktop Only */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex flex-col justify-center px-16 xl:px-20 2xl:px-28 w-[48%] max-w-[640px]"
                >
                    {leftPanel}
                </motion.div>

                {/* Right Panel */}
                <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-16 sm:py-20 lg:py-0">

                    {/* ─── Mobile M.I.A. Orb Hero ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:hidden flex flex-col items-center mb-4 sm:mb-6"
                    >
                        {/* Orb with static glow behind (no animated scale on mobile) */}
                        <div className="relative">
                            <div
                                className="absolute inset-[-12px] sm:inset-[-18px] rounded-full blur-[25px] sm:blur-[30px] opacity-[0.12]"
                                style={{ backgroundColor: theme.primaryGlow, transform: "translateZ(0)" }}
                            />
                            <MiaOrb size={80} state={orbState} />
                        </div>
                        <div className="text-center mt-3">
                            <h1 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-white/90">{mobileTitle}</h1>
                            <p
                                className="text-[11px] font-bold mt-1 tracking-[0.18em] uppercase opacity-60"
                                style={{ color: theme.primaryGlow }}
                            >
                                {mobileSubtitle}
                            </p>
                        </div>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        className="w-full max-w-[440px] relative"
                    >
                        {/* Ambient card glow — static, GPU-friendly */}
                        <div
                            className="absolute -inset-4 sm:-inset-6 lg:-inset-8 rounded-[36px] sm:rounded-[50px] lg:rounded-[60px] blur-[30px] sm:blur-[40px] lg:blur-[60px] opacity-[0.04] sm:opacity-[0.05] lg:opacity-[0.06]"
                            style={{ backgroundColor: theme.primaryGlow, transform: "translateZ(0)" }}
                        />
                        <div className="relative z-10">
                            {children}
                        </div>
                    </motion.div>

                    {/* ─── Mobile Trust Badges ─── */}
                    {trustBadges && trustBadges.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="lg:hidden mt-6 sm:mt-8 w-full max-w-[440px]"
                        >
                            <div className="flex flex-wrap justify-center gap-2.5">
                                {trustBadges.map((badge, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]"
                                    >
                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center shrink-0">
                                            {badge.icon}
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] text-white/40 font-semibold tracking-wide">{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Mobile Security Note ─── */}
                    {securityNote && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="lg:hidden mt-5 sm:mt-6 w-full max-w-[440px]"
                        >
                            {securityNote}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 text-center z-20 pointer-events-none">
                <p className="text-white/10 text-[8px] sm:text-[9px] uppercase font-sans tracking-[0.4em] sm:tracking-[0.5em] font-semibold">
                    FINMOM Platform • 2026
                </p>
            </div>
        </main>
    );
}
