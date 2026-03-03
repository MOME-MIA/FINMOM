"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";
import { motion } from "framer-motion";
import { Shield, Mail, Clock, CheckCircle, XCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions";

interface WaitlistEntry {
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            // Very basic client-side check. Real security is enforced by RLS in DB.
            if (!user) {
                router.push("/login");
            } else if (user.email !== "agenciamom.contacto@gmail.com") {
                router.push("/dashboard"); // Normal users go to dash
            } else {
                fetchWaitlist();
            }
        }
    }, [user, isLoaded, router]);

    const fetchWaitlist = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await insforge.database
                .from("waitlist")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setEntries(data as WaitlistEntry[]);
        } catch (error: any) {
            console.error("Error fetching waitlist:", error);
            toast.error("Error al obtener la lista de espera.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (email: string, newStatus: 'approved' | 'rejected') => {
        try {
            const { error } = await insforge.database
                .from("waitlist")
                .update({ status: newStatus })
                .eq("email", email);

            if (error) throw error;

            toast.success(`Usuario marcado como ${newStatus}`);
            fetchWaitlist(); // refresh
        } catch (error: any) {
            console.error("Error updating status:", error);
            toast.error("Error al actualizar estado");
        }
    };

    const handleLogout = async () => {
        await logoutAction();
        router.push("/login");
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-[#BF5AF2] animate-spin" />
            </div>
        );
    }

    // Protection to avoid flash of content
    if (!user || user.email !== "agenciamom.contacto@gmail.com") {
        return null;
    }

    const pendingCount = entries.filter((e) => e.status === "pending").length;
    const approvedCount = entries.filter((e) => e.status === "approved").length;

    return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-12 md:p-24 selection:bg-[#BF5AF2]/30 selection:text-white relative">
            {/* Background elements to match Total Black */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BF5AF2]/5 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] mix-blend-screen opacity-30" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-[#BF5AF2]" />
                            <h1 className="text-3xl font-bold tracking-tighter">Terminal Administrativa</h1>
                        </div>
                        <p className="text-white/40 text-sm tracking-wide">
                            {user.email} • M.I.A. Override Active
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 px-6 border border-white/10 backdrop-blur-md">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-white">{pendingCount}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/50">Pendientes</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-[#BF5AF2]">{approvedCount}</span>
                                <span className="text-[10px] uppercase tracking-wider text-[#BF5AF2]/60">Aprobados</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-white/5 hover:bg-white/10 text-white/70 p-4 rounded-xl transition-colors border border-white/10"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="bg-[#050505] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40 bg-white/5">
                                    <th className="p-6 font-medium">Email</th>
                                    <th className="p-6 font-medium">Fecha de Solicitud</th>
                                    <th className="p-6 font-medium">Estado</th>
                                    <th className="p-6 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-white/40">
                                            No hay usuarios en la lista de espera.
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry, index) => (
                                        <motion.tr
                                            key={entry.email}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium">{entry.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-white/50 text-sm">
                                                {new Date(entry.created_at).toLocaleString('es-AR', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="p-6">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide ${entry.status === 'approved'
                                                    ? 'bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20'
                                                    : entry.status === 'rejected'
                                                        ? 'bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20'
                                                        : 'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20'
                                                    }`}>
                                                    {entry.status === 'pending' && <Clock className="w-3 h-3" />}
                                                    {entry.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                    {entry.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                    {entry.status.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                {entry.status === 'pending' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => updateStatus(entry.email, 'rejected')}
                                                            className="px-4 py-2 rounded-lg text-xs font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            RECHAZAR
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(entry.email, 'approved')}
                                                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#BF5AF2]/10 text-[#BF5AF2] hover:bg-[#BF5AF2]/20 border border-[#BF5AF2]/20 transition-all shadow-[0_0_15px_rgba(191,90,242,0.15)]"
                                                        >
                                                            AUTORIZAR
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
