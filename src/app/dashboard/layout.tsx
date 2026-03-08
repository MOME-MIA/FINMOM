"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileTopHeader } from "@/components/ui/MobileTopHeader";
import { SearchProvider } from "@/components/SearchModal";
import { FinancialProvider } from "@/context/FinancialContext";
import { DateProvider } from "@/context/DateContext";
import { MiaProvider } from "@/components/chat/MiaContext";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MarketTicker } from "@/components/layout/MarketTicker";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <>
            {/* 1. Base Layer: Pure Black */}
            <div className="fixed inset-0 z-[-10] bg-black" />

            {/* Unified Fixed Top: Ticker + Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col md:contents">
                <MarketTicker />
                <div className="md:hidden">
                    <MobileTopHeader />
                </div>
            </div>

            {/* Desktop Navigation */}
            <Sidebar />
            <Navbar />

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 w-full overflow-y-auto h-screen no-scrollbar relative z-0 transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pb-[calc(var(--nav-height)+24px)] md:pb-8 pt-[var(--header-height)] md:pt-[56px]",
                    collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
                )}
            >
                <div className="max-w-7xl mx-auto h-full flex flex-col px-4 sm:px-6 md:px-8">
                    <div className="w-full pt-4 md:pt-6 pb-2 md:pb-4 z-10 relative">
                        <Breadcrumbs />
                    </div>
                    <div className="flex-1 space-y-4">
                        {children}
                    </div>
                </div>
            </main>

            {/* Global M.I.A. Orb */}
            <ChatAssistant />
        </>
    );
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SearchProvider>
            <FinancialProvider>
                <MiaProvider>
                    <DateProvider>
                        <SidebarProvider>
                            <DashboardContent>{children}</DashboardContent>
                        </SidebarProvider>
                    </DateProvider>
                </MiaProvider>
            </FinancialProvider>
        </SearchProvider>
    );
}
