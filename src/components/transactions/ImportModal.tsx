"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { MonthlyRecord, TransactionType } from "@/types/finance";
import { Loader2, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { bulkAddTransactionsAction } from "@/app/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Omit<MonthlyRecord, 'id'>[]>([]);
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        setParsing(true);
        setError(null);
        setPreview([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsedData = results.data.map((row: any) => {
                        // Basic validation and mapping
                        // Expecting columns: Date, Type, AmountARS, AmountUSD, Category, Description, PaymentMethod
                        // Or try to map intelligently

                        const date = row.Date || row.Fecha || new Date().toISOString().split('T')[0];
                        const type = (row.Type || row.Tipo || 'Gasto Semanal') as TransactionType;
                        const amountARS = parseFloat(row.AmountARS || row.MontoARS || row.ARS || '0');
                        const amountUSD = parseFloat(row.AmountUSD || row.MontoUSD || row.USD || '0');
                        const category = row.Category || row.Categoria || 'Varios';
                        const description = row.Description || row.Descripcion || 'Importado';
                        const paymentMethod = row.PaymentMethod || row.MetodoPago || 'Debit';

                        if (isNaN(amountARS) && isNaN(amountUSD)) {
                            throw new Error("Invalid amount in row");
                        }

                        return {
                            date,
                            type,
                            amountARS: isNaN(amountARS) ? 0 : amountARS,
                            amountUSD: isNaN(amountUSD) ? 0 : amountUSD,
                            category,
                            description,
                            paymentMethod
                        };
                    });
                    setPreview(parsedData);
                } catch (err) {
                    setError("Error parsing CSV. Please check the format.");
                } finally {
                    setParsing(false);
                }
            },
            error: (err) => {
                setError("Error reading file: " + err.message);
                setParsing(false);
            }
        });
    };

    const handleImport = async () => {
        if (preview.length === 0) return;
        setLoading(true);
        try {
            const success = await bulkAddTransactionsAction(preview);
            if (success) {
                toast.success(`${preview.length} transacciones importadas`);
                onSuccess();
                onClose();
            } else {
                toast.error("Error al importar transacciones");
            }
        } catch (error) {
            toast.error("Error crítico al importar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-void-950 border-void-800 text-void-50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gradient-obsidian flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-teal-500" />
                        Importar Transacciones
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {!file ? (
                        <div className="border-2 border-dashed border-void-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-void-900/50 transition-colors cursor-pointer relative">
                            <Input
                                type="file"
                                accept=".csv"
                                aria-label="Archivo CSV"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="h-10 w-10 text-void-400 mb-4" />
                            <p className="text-sm font-medium text-void-200">Arrastra un archivo CSV o haz clic para seleccionar</p>
                            <p className="text-xs text-void-500 mt-2">Formato: Fecha, Tipo, MontoARS, Categoria, Descripcion</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-void-900/50 p-3 rounded-lg border border-void-800">
                                <div className="flex items-center gap-3">
                                    <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-medium text-void-200">{file.name}</p>
                                        <p className="text-xs text-void-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPreview([]); }} className="text-void-400 hover:text-red-400">
                                    Cambiar
                                </Button>
                            </div>

                            {parsing ? (
                                <div className="flex items-center justify-center py-8 text-void-400">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Analizando archivo...
                                </div>
                            ) : error ? (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3 text-red-400">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-void-400">Vista previa ({preview.length} registros)</p>
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto rounded-lg border border-void-800 bg-void-900/30">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-void-900 text-void-400 sticky top-0">
                                                <tr>
                                                    <th className="p-2">Fecha</th>
                                                    <th className="p-2">Desc.</th>
                                                    <th className="p-2 text-right">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-void-800/50">
                                                {preview.slice(0, 10).map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 text-void-300">{row.date}</td>
                                                        <td className="p-2 text-void-300 truncate max-w-[150px]">{row.description}</td>
                                                        <td className="p-2 text-right font-mono text-void-200">{row.amountARS || row.amountUSD}</td>
                                                    </tr>
                                                ))}
                                                {preview.length > 10 && (
                                                    <tr>
                                                        <td colSpan={3} className="p-2 text-center text-void-500 italic">
                                                            ... y {preview.length - 10} más
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={loading || preview.length === 0 || !!error}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Importar {preview.length > 0 && `(${preview.length})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
