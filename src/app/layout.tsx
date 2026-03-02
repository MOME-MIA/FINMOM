import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

const goia = localFont({
  src: [
    {
      path: "../../public/fonts/GoiaVariable.ttf",
      style: "normal",
    },
  ],
  variable: "--font-goia",
  display: "swap",
});

const goiaDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/GoiaDisplayVariable.ttf",
      style: "normal",
    },
  ],
  variable: "--font-goia-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Momentum Finance',
    default: 'Momentum Finance Manager',
  },
  applicationName: 'MOMENTUM OS',
  description: 'Financial Health Command Center & Crypto Intelligence',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MOMENTUM OS',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://momentum-finance.vercel.app',
    title: 'Momentum Finance Manager',
    description: 'Control total de tus finanzas personales y criptoactivos.',
    siteName: 'Momentum Finance',
  },
};

import { Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { NativeSystemProvider } from "@/components/NativeSystemProvider";
import { getAuthFromCookies } from "@insforge/nextjs";
import { Providers as InsforgeAuthProviders } from "./providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = await getAuthFromCookies();

  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${goia.variable} ${goiaDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased bg-black text-white relative min-h-screen overflow-x-hidden selection:bg-white/20`}>
        {/* Skip Navigation Link (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-white focus:text-black focus:rounded-lg focus:font-bold focus:text-sm focus:shadow-xl focus:outline-none"
        >
          Saltar al contenido
        </a>
        <InsforgeAuthProviders initialState={initialState}>
          <QueryProvider>
            <NativeSystemProvider>
              <ThemeProvider>
                <CurrencyProvider>
                  {children}
                </CurrencyProvider>
                <Toaster position="bottom-right" theme="dark" />
              </ThemeProvider>
            </NativeSystemProvider>
          </QueryProvider>
        </InsforgeAuthProviders>
      </body>
    </html>
  );
}
