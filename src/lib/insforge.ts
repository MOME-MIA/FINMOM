import { createClient } from "@insforge/sdk";

// Initialize the InsForge backend client
export const insforge = createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "",
});
