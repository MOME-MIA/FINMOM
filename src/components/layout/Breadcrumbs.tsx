"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Mapping of path segments to readable names
const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    accounts: "Cuentas",
    analytics: "Analítica",
    expenses: "Gastos",
    budgets: "Presupuestos",
    history: "Historial",
    settings: "Ajustes de Perfil",
    add: "Nueva Transacción",
};

export function Breadcrumbs() {
    const pathname = usePathname();

    // Only show on dashboard pages
    if (!pathname.startsWith("/dashboard")) return null;

    // Remove empty segments and 'dashboard' (since we use a home icon for it)
    const segments = pathname.split("/").filter(Boolean);
    const isDashboardRoot = segments.length === 1 && segments[0] === "dashboard";

    return (
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-2 text-[11px] font-medium tracking-wide">
            <Link
                href="/dashboard"
                className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    isDashboardRoot
                        ? "text-white/80 cursor-default pointer-events-none"
                        : "text-white/40 hover:text-white"
                )}
                aria-current={isDashboardRoot ? "page" : undefined}
            >
                <Home className="w-3.5 h-3.5" strokeWidth={isDashboardRoot ? 2 : 1.5} />
                <span className="sr-only">Dashboard</span>
            </Link>

            {!isDashboardRoot && segments.map((segment, index) => {
                if (segment === "dashboard") return null;

                const isLast = index === segments.length - 1;
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                return (
                    <div key={href} className="flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-white/20" strokeWidth={1.5} />
                        <Link
                            href={href}
                            className={cn(
                                "transition-colors",
                                isLast
                                    ? "text-white/80 cursor-default pointer-events-none"
                                    : "text-white/50 hover:text-white"
                            )}
                            aria-current={isLast ? "page" : undefined}
                        >
                            {name}
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
}
