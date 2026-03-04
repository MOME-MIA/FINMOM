import { create } from 'zustand';

export type MiaStatus = 'idle' | 'success' | 'checking' | 'error' | 'alert' | 'thinking';

export interface MiaNotification {
    id: string;
    message: string;
    status: MiaStatus;
    duration?: number; // 0 for persistent
    isUrgent?: boolean;
}

interface MiaStore {
    notifications: MiaNotification[];
    notify: (notification: Omit<MiaNotification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;

    // PWA Install Prompt State
    deferredPrompt: any;
    setDeferredPrompt: (prompt: any) => void;
    showInstallPrompt: boolean;
    setShowInstallPrompt: (show: boolean) => void;
}

export const useMiaStore = create<MiaStore>((set) => ({
    notifications: [],
    notify: (notification) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [...state.notifications, { ...notification, id }],
        }));

        // Auto remove if duration is provided
        if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, notification.duration);
        }
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    clearAll: () => set({ notifications: [] }),

    deferredPrompt: null,
    setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
    showInstallPrompt: false,
    setShowInstallPrompt: (show) => set({ showInstallPrompt: show }),
}));
