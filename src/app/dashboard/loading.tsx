import { PageLayout } from "@/components/layout/PageLayout";

export default function Loading() {
    return (
        <PageLayout title="Dashboard">
            <div className="space-y-4 pb-12 animate-pulse">

                {/* HERO SECTION SKELETON */}
                <div className="flex flex-col items-center justify-center pt-2 pb-6">
                    <div className="h-3 w-24 bg-white/5 rounded-full mb-4"></div>
                    <div className="flex items-start justify-center gap-1.5 w-full max-w-sm px-4">
                        <div className="h-8 w-8 bg-white/5 rounded-full shrink-0 mt-2"></div>
                        <div className="h-20 w-64 bg-white/5 rounded-2xl"></div>
                    </div>
                </div>

                {/* MINIMALIST KPIS SKELETON */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto mb-6 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-4 md:p-5 backdrop-blur-xl">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center">
                            <div className="h-2.5 w-16 bg-white/5 rounded-full mb-3"></div>
                            <div className="h-7 w-20 bg-white/5 rounded-xl"></div>
                        </div>
                    ))}
                </div>

                {/* MAIN BENTO BOX GRID SKELETON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-64 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                            <div className="h-64 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                        </div>
                        <div className="h-72 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                            <div className="h-32 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                        </div>
                        <div className="h-80 bg-white/[0.02] border border-white/[0.02] rounded-3xl"></div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
