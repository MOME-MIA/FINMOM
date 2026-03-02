"use client";

import { ReactNode } from "react";
import { InsforgeBrowserProvider } from "@insforge/nextjs";
import { InitialAuthState } from "@insforge/react";
import { insforge } from "@/lib/insforge";

export function Providers({
    children,
    initialState,
}: {
    children: ReactNode;
    initialState?: any;
}) {
    return (
        <InsforgeBrowserProvider client={insforge} initialState={initialState}>
            {children}
        </InsforgeBrowserProvider>
    );
}
