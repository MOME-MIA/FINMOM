import { getAccountsAction } from "@/app/actions";
import { AccountsClient } from "./AccountsClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cuentas | Finmom',
    description: 'Gestión de Cuentas y Divisas',
};



export default async function AccountsPage() {
    const accounts = await getAccountsAction();
    return <AccountsClient initialAccounts={accounts || []} />;
}
