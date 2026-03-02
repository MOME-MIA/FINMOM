"use client";

import { StackHeader } from "@/components/layout/StackHeader";
import { motion, Variants } from "framer-motion";
import { useFinancial } from "@/context/FinancialContext";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }
};

export default function DnaSettingsPage() {
    const { baseStrategy, setBaseStrategy } = useFinancial();

    // Cascading mathematical logic
    // 1. Savings takes X% of Total (100%)
    const savingsPct = baseStrategy.savings;
    // 2. Investment takes Y% of the REMAINDER after savings
    const investmentPctOfRemainder = baseStrategy.investment;

    // Calculate absolute percentages
    const absoluteSavings = savingsPct;
    const remainderAfterSavings = 100 - absoluteSavings;
    const absoluteInvestment = (remainderAfterSavings * investmentPctOfRemainder) / 100;

    // 3. Needs & Wants split the FINAL REMAINDER
    const finalRemainder = remainderAfterSavings - absoluteInvestment;
    const needsRelativePct = baseStrategy.needs; // What % of finalRemainder goes to Needs
    const absoluteNeeds = (finalRemainder * needsRelativePct) / 100;
    const absoluteWants = finalRemainder - absoluteNeeds;

    const handleSavingsChange = (value: number) => {
        setBaseStrategy({ ...baseStrategy, savings: value });
    };

    const handleInvestmentChange = (value: number) => {
        setBaseStrategy({ ...baseStrategy, investment: value });
    };

    const handleNeedsWantsChange = (needsValue: number) => {
        setBaseStrategy({
            ...baseStrategy,
            needs: needsValue,
            wants: 100 - needsValue
        });
    };

    return (
        <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
            <StackHeader title="Financial DNA" backPath="/settings" />

            <p className="text-white/50 text-[15px] mb-8 leading-relaxed px-1 mt-2">
                Ajustá tu distribución maestra de ingresos. Estos valores son la base que M.I.A. utilizará para tus proyecciones financieras globales.
            </p>

            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* DNA Visualizer Bar */}
                <motion.div variants={itemVariants} className="w-full h-4 rounded-full overflow-hidden flex bg-white/5 border border-white/10 shadow-inner">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#30B04F] to-[#34C759]"
                        animate={{ width: `${absoluteSavings}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#9B48C7] to-[#AF52DE]"
                        animate={{ width: `${absoluteInvestment}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#0070DF] to-[#0A84FF]"
                        animate={{ width: `${absoluteNeeds}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#E58F09] to-[#FF9F0A]"
                        animate={{ width: `${absoluteWants}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="bg-[#1c1c1e]/60 backdrop-blur-xl rounded-[32px] p-6 border border-white/[0.06] shadow-sm space-y-8">
                    <LiquidSlider
                        label="Colchón de Ahorros"
                        sublabel="% del Ingreso Total (Se descuenta primero)"
                        value={savingsPct}
                        onChange={handleSavingsChange}
                        colorClass="from-[#30B04F] to-[#34C759]"
                        textColor="text-[#34C759]"
                    />

                    <div className="pl-4 border-l-2 border-white/[0.05] space-y-8">
                        <LiquidSlider
                            label="Flujo de Inversiones"
                            sublabel={`% del ${remainderAfterSavings.toFixed(1)}% Restante`}
                            value={investmentPctOfRemainder}
                            onChange={handleInvestmentChange}
                            colorClass="from-[#9B48C7] to-[#AF52DE]"
                            textColor="text-[#AF52DE]"
                        />

                        <div className="pt-2">
                            <div className="flex justify-between items-end mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[16px] font-medium text-white/90">Distribución de Vida</span>
                                    <span className="text-[13px] text-white/50">Gobernando el {finalRemainder.toFixed(1)}% final del capital</span>
                                </div>
                            </div>

                            <DualBalanceSlider
                                needsValue={baseStrategy.needs}
                                wantsValue={baseStrategy.wants}
                                onChange={handleNeedsWantsChange}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function LiquidSlider({ label, sublabel, value, onChange, colorClass, textColor }: any) {
    return (
        <div className="space-y-4 group">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[17px] font-medium text-white/90">{label}</span>
                    {sublabel && <span className="text-[13px] text-white/50">{sublabel}</span>}
                </div>
                <span className={cn("text-[18px] font-bold font-sans tracking-tight", textColor)}>{Math.round(value)}%</span>
            </div>

            <div className="relative w-full h-10 bg-black/40 rounded-full overflow-hidden border border-white/[0.05] shadow-inner touch-none">
                <motion.div
                    className={cn("absolute top-0 left-0 h-full rounded-full bg-gradient-to-r", colorClass)}
                    style={{ width: `${value}%` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                />
            </div>
        </div>
    );
}

function DualBalanceSlider({ needsValue, wantsValue, onChange }: { needsValue: number, wantsValue: number, onChange: (needs: number) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <span className="text-[14px] font-semibold text-[#0A84FF]">Necesidades fíjadas: {Math.round(needsValue)}%</span>
                <span className="text-[14px] font-semibold text-[#FF9F0A]">{Math.round(wantsValue)}% Ocio</span>
            </div>
            <div className="relative w-full h-10 bg-gradient-to-r from-[#0A84FF] to-[#FF9F0A] rounded-full overflow-hidden border border-white/[0.05] shadow-inner touch-none">
                <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-[#0A84FF] z-0"
                    style={{ width: `${needsValue}%` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />

                {/* Center thumb indicator */}
                <motion.div
                    className="absolute top-[6px] bottom-[6px] w-[6px] bg-white rounded-full z-10 shadow-lg"
                    style={{ left: `calc(${needsValue}% - 3px)` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={needsValue}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
            </div>
        </div>
    );
}
