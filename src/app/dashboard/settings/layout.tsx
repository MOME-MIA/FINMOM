import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ajustes',
    description: 'Configurá tu perfil, seguridad, notificaciones y preferencias de la aplicación.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
