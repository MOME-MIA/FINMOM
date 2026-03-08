"use client";

import { SplashScreen } from "@/components/ui/SplashScreen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
    return <SplashScreen>{children}</SplashScreen>;
}
