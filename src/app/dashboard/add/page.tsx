import { Suspense } from 'react';
import { AddClient } from "./AddClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nueva Transacción',
    description: 'Registrá un nuevo ingreso o gasto en tu sistema financiero.',
};

export default function AddPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <AddClient />
        </Suspense>
    );
}
