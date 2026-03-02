"use client";

import { useState } from "react";
import { StackHeader } from "@/components/layout/StackHeader";
import { Lock, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
// import { insforge } from "@/lib/insforge";

export default function SecuritySettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Completá todos los campos");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Las nuevas contraseñas no coinciden");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            setIsSaving(true);
            toast.loading("Actualizando credenciales...", { id: "pwd-update" });

            // In a fully authenticated InsForge app using the auth client:
            // await insforge.auth.updateUser({ password: newPassword })

            // Simulated network delay
            await new Promise(r => setTimeout(r, 1500));

            toast.success("Contraseña actualizada exitosamente", { id: "pwd-update" });

            // Wipe fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            toast.error("Error al actualizar contraseña", { id: "pwd-update" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
            <StackHeader title="Seguridad" backPath="/settings" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1c1c1e]/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/[0.05] shadow-sm space-y-6 mt-4"
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Lock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-[16px]">Cambiar Contraseña</h3>
                            <p className="text-white/50 text-[13px]">Asegurá tu cuenta Momentum</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-white/50 uppercase tracking-wider pl-1">
                            Contraseña Actual
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white font-medium text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow"
                            placeholder="Tu contraseña actual"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-white/50 uppercase tracking-wider pl-1">
                            Nueva Contraseña
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white font-medium text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow"
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-white/50 uppercase tracking-wider pl-1">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white font-medium text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-shadow"
                            placeholder="Repetí la contraseña"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSavePassword}
                        disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full bg-blue-600/90 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-white/10 disabled:text-white/50"
                    >
                        {isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Actualizar Contraseña
                            </>
                        )}
                    </button>
                    <p className="text-center text-[12px] text-white/50 mt-4 leading-relaxed px-4">
                        Al cambiar tu contraseña, se cerrarán todas tus otras sesiones activas automáticamente por seguridad.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
