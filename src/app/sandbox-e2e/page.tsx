import { AddTransactionForm } from '@/components/dashboard/AddTransactionForm';

export default function SandboxE2EAddTransactionPage() {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-zinc-950 text-white leading-relaxed">
            <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
                <AddTransactionForm />
            </div>
        </div>
    );
}
