import { Metadata } from "next";
import MomCapitalClient from "./MomCapitalClient";

export const metadata: Metadata = {
    title: "MOM Capital | Private Wealth",
    description: "Acceso exclusivo para gestión de patrimonios y Private Wealth",
}

export default function MomCapitalPage() {
    return <MomCapitalClient />;
}
