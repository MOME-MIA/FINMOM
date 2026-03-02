/**
 * Profile Management Module — InsForge SDK
 * Handles user profile data, avatar uploads, and authentication state.
 */

import { insforge } from './insforge';

// ─── Types ─────────────────────────────────────────
export type ProfileData = {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    finance_style: string | null;
    email: string | null;
};

// ─── Constants ─────────────────────────────────────
const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Fetch Profile ─────────────────────────────────
export const fetchProfile = async (): Promise<ProfileData | null> => {
    try {
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        const user = sessionData.session?.user;
        if (!user) return null;

        // Try to fetch from profiles table first
        const { data: profileRow } = await insforge.database
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileRow) {
            return {
                id: user.id,
                display_name: profileRow.display_name || user.profile?.name || null,
                avatar_url: profileRow.avatar_url || user.profile?.avatar_url || null,
                finance_style: profileRow.finance_style || null,
                email: user.email || null,
            };
        }

        // Fallback: return data from auth user profile/metadata
        return {
            id: user.id,
            display_name: user.profile?.name || (user.metadata as any)?.display_name || null,
            avatar_url: user.profile?.avatar_url || null,
            finance_style: null,
            email: user.email || null,
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        // Return a basic fallback so the UI doesn't crash
        try {
            const { data } = await insforge.auth.getCurrentSession();
            const user = data.session?.user;
            if (user) {
                return {
                    id: user.id,
                    display_name: user.profile?.name || 'Usuario',
                    avatar_url: user.profile?.avatar_url || null,
                    finance_style: null,
                    email: user.email || null,
                };
            }
        } catch { /* silent */ }
        return null;
    }
};

// ─── Update Display Name ───────────────────────────
export const updateDisplayName = async (
    newName: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        const user = sessionData.session?.user;
        if (!user) return { success: false, error: 'No autenticado' };

        // Update profiles table (primary storage for display name)
        const { error: dbError } = await insforge.database
            .from('profiles')
            .upsert({
                id: user.id,
                display_name: newName,
                updated_at: new Date().toISOString(),
            });

        if (dbError) {
            return { success: false, error: dbError.message || 'Error actualizando nombre' };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error?.message || 'Error inesperado' };
    }
};

// ─── Update Profile (Generic) ──────────────────────
export const updateProfile = async (updates: Partial<ProfileData>): Promise<void> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    const user = sessionData.session?.user;
    if (!user) return;

    await insforge.database
        .from('profiles')
        .upsert({
            id: user.id,
            ...updates,
            updated_at: new Date().toISOString(),
        });
};

// ─── Validate Image File ───────────────────────────
export const validateImageFile = (
    file: File
): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Solo se permiten imágenes JPG, PNG o WebP' };
    }
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'La imagen no puede superar los 5MB' };
    }
    return { valid: true };
};

// ─── Upload Avatar ─────────────────────────────────
export const uploadAvatar = async (
    file: File,
    onProgress?: (pct: number) => void
): Promise<{ error?: string; url?: string }> => {
    try {
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        const user = sessionData.session?.user;
        if (!user) return { error: 'No autenticado' };

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/avatar_${Date.now()}.${ext}`;

        // Simulate progress (InsForge SDK doesn't support progress callbacks natively)
        onProgress?.(10);

        // Upload to InsForge Storage
        const { error: uploadError } = await insforge.storage
            .from(AVATAR_BUCKET)
            .upload(fileName, file);

        onProgress?.(70);

        if (uploadError) {
            return { error: (uploadError as any).message || 'Error subiendo imagen' };
        }

        // Get public URL
        const publicUrlResult = insforge.storage
            .from(AVATAR_BUCKET)
            .getPublicUrl(fileName);

        // InsForge getPublicUrl returns a string directly
        const publicUrl = typeof publicUrlResult === 'string'
            ? publicUrlResult
            : (publicUrlResult as any)?.data?.publicUrl || (publicUrlResult as any)?.publicUrl || null;

        if (!publicUrl) {
            return { error: 'No se pudo obtener la URL pública' };
        }

        onProgress?.(85);

        // Update profiles table with new avatar URL
        const { error: dbError } = await insforge.database
            .from('profiles')
            .upsert({
                id: user.id,
                avatar_url: publicUrl,
                updated_at: new Date().toISOString(),
            });

        if (dbError) {
            console.error('Error updating avatar in profiles:', dbError);
        }

        onProgress?.(100);

        return { url: publicUrl };
    } catch (error: any) {
        return { error: error?.message || 'Error inesperado al subir avatar' };
    }
};

// ─── Logout ────────────────────────────────────────
export const performLogout = async (): Promise<void> => {
    try {
        await insforge.auth.signOut();
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
