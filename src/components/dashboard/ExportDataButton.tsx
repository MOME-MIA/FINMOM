"use client";
import React from 'react';
import { Download, FileDown } from 'lucide-react';

export const ExportDataButton = () => {
    return (
        <a
            href="/api/export"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-[#0a0a0a] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
            <FileDown size={16} className="text-white/70" />
            <span>Exportar a Excel (.csv)</span>
        </a>
    );
};
