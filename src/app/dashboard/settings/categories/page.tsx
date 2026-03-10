import { Suspense } from 'react';
import CategoriesClient from './CategoriesClient';
import { fetchCategories } from '@/lib/db';
import { Settings, Tag } from 'lucide-react';
import Link from 'next/link';
import { StackHeader } from '@/components/layout/StackHeader';

export const metadata = {
    title: 'Categorías | FINMOM',
    description: 'Gestión de categorías financieras',
};

export default async function CategoriesPage() {
    const categories = await fetchCategories();

    return (
        <div className="min-h-screen bg-[#0A0A0A] pb-[120px]">
            <StackHeader title="Categorías" backPath="/dashboard/settings" />
            <div className="max-w-2xl mx-auto px-4 mt-8">
                <CategoriesClient initialCategories={categories} />
            </div>
        </div>
    );
}
