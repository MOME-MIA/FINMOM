import { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
    title: "M.I.A. Override | Admin",
    description: "Terminal Administrativa para gestión de usuarios",
}

export default function AdminPage() {
    return <AdminClient />;
}
