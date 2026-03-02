"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { StackHeader } from "@/components/layout/StackHeader";
import { User, Camera, Loader2, Save, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    fetchProfile,
    updateDisplayName,
    uploadAvatar,
    validateImageFile,
    type ProfileData,
} from "@/lib/insforgeProfile";

export default function ProfileSettingsPage() {
    // ─── State ──────────────────────────────────────────
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ name?: string }>({});
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Load Profile ───────────────────────────────────
    useEffect(() => {
        fetchProfile().then((p) => {
            setProfile(p);
            setName(p?.display_name || "");
            setAvatarUrl(p?.avatar_url || null);
        });
    }, []);

    // ─── Derived State ──────────────────────────────────
    const hasChanges = profile
        ? name !== profile.display_name || avatarUrl !== profile.avatar_url
        : false;
    const hasErrors = Object.keys(errors).length > 0;
    const canSave = hasChanges && !hasErrors && !isSaving && !isUploadingAvatar;

    // ─── Validation ─────────────────────────────────────
    const validateName = useCallback((value: string) => {
        if (value.trim().length < 2) {
            setErrors((prev) => ({ ...prev, name: "Mínimo 2 caracteres" }));
        } else if (value.trim().length > 50) {
            setErrors((prev) => ({ ...prev, name: "Máximo 50 caracteres" }));
        } else {
            setErrors((prev) => {
                const { name: _, ...rest } = prev;
                return rest;
            });
        }
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        validateName(val);
    };

    // ─── Avatar Upload ──────────────────────────────────
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        // Instant preview
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
        setIsUploadingAvatar(true);
        setUploadProgress(0);

        // Upload
        const result = await uploadAvatar(file, (pct) => setUploadProgress(pct));

        if (result.error) {
            toast.error(result.error);
            setAvatarUrl(profile?.avatar_url || null); // rollback
        } else if (result.url) {
            setAvatarUrl(result.url);
            toast.success("Foto actualizada");
        }

        setIsUploadingAvatar(false);
        setUploadProgress(0);
        URL.revokeObjectURL(previewUrl);
    };

    // ─── Save Profile ───────────────────────────────────
    const handleSaveProfile = async () => {
        if (!canSave) return;
        setIsSaving(true);

        try {
            if (name !== profile?.display_name) {
                const result = await updateDisplayName(name.trim());
                if (!result.success) {
                    toast.error(result.error || "Error al guardar");
                    setIsSaving(false);
                    return;
                }
            }

            setSaveSuccess(true);
            toast.success("Perfil actualizado");

            // Update local profile state
            setProfile((prev) =>
                prev ? { ...prev, display_name: name.trim(), avatar_url: avatarUrl } : prev
            );

            setTimeout(() => {
                setSaveSuccess(false);
                setIsSaving(false);
            }, 1200);
        } catch {
            toast.error("Error inesperado al guardar");
            setIsSaving(false);
        }
    };

    // ─── Loading State ──────────────────────────────────
    if (!profile) {
        return (
            <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
                <StackHeader title="Perfil" backPath="/settings" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white/50 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
            <StackHeader title="Perfil" backPath="/settings" />

            {/* ─── Avatar Section ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-4 mb-8 flex flex-col items-center"
            >
                <div className="relative group">
                    {/* Ambient glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent blur-3xl scale-[1.8] opacity-50 pointer-events-none" />

                    {/* Avatar */}
                    <div
                        onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                        className={cn(
                            "relative h-[120px] w-[120px] rounded-full overflow-hidden cursor-pointer",
                            "ring-[1.5px] ring-white/[0.08] ring-offset-[3px] ring-offset-black",
                            "shadow-[0_16px_48px_rgba(0,0,0,0.6)]",
                            "transition-all duration-300",
                            "group-hover:ring-white/[0.15] group-hover:shadow-[0_16px_56px_rgba(0,0,0,0.7)]"
                        )}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                                <User className="h-12 w-12 text-white/50" strokeWidth={1.5} />
                            </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Camera className="h-7 w-7 text-white/90" />
                        </div>

                        {/* Upload progress ring */}
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                                    <circle
                                        cx="28" cy="28" r="24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 24}`}
                                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - uploadProgress / 100)}`}
                                        className="transition-all duration-300"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Camera badge */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className={cn(
                            "absolute -bottom-1 -right-1",
                            "h-10 w-10 rounded-full",
                            "bg-white text-black",
                            "flex items-center justify-center",
                            "shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
                            "border-2 border-black",
                            "hover:scale-110 active:scale-95",
                            "transition-transform duration-200",
                            "disabled:opacity-50"
                        )}
                    >
                        <Camera className="h-4.5 w-4.5" />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>
            </motion.div>

            {/* ─── Form Card ─── */}
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] p-6 border border-white/[0.04] shadow-sm space-y-6"
            >
                {/* Name field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em] pl-0.5">
                        Nombre de Usuario
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            maxLength={50}
                            className={cn(
                                "w-full bg-white/[0.03] rounded-2xl px-4 py-4",
                                "text-white font-medium text-[16px]",
                                "border transition-all duration-200",
                                "focus:outline-none focus:ring-1",
                                "placeholder:text-white/15",
                                errors.name
                                    ? "border-red-500/30 focus:border-red-500/50 focus:ring-red-500/20"
                                    : "border-white/[0.05] focus:border-white/[0.15] focus:ring-white/[0.06]"
                            )}
                            placeholder="Tu nombre completo"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/15 tabular-nums select-none">
                            {name.length}/50
                        </span>
                    </div>
                    <AnimatePresence>
                        {errors.name && (
                            <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                className="text-[11px] text-red-400/80 flex items-center gap-1 pl-1"
                            >
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors.name}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Email field (read-only) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em] pl-0.5">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        value={profile.email || ""}
                        readOnly
                        className="w-full bg-white/[0.015] rounded-2xl px-4 py-4 text-white/50 font-medium text-[16px] border border-white/[0.03] cursor-not-allowed select-none"
                    />
                    <p className="text-[11px] text-white/50 pl-1 leading-relaxed">
                        El correo está vinculado a tu cuenta global y no puede modificarse desde aquí.
                    </p>
                </div>
            </motion.div>

            {/* ─── Save Button ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
            >
                <button
                    onClick={handleSaveProfile}
                    disabled={!canSave}
                    className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-[16px]",
                        "flex items-center justify-center gap-2.5",
                        "transition-all duration-300 ease-out",
                        "active:scale-[0.97]",
                        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                        saveSuccess
                            ? "bg-emerald-500 text-white"
                            : canSave
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-white/[0.04] text-white/50 cursor-not-allowed shadow-none"
                    )}
                >
                    {saveSuccess ? (
                        <>
                            <Check className="h-5 w-5" />
                            Guardado
                        </>
                    ) : isSaving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Guardar Cambios
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
