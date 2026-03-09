import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { MiaNotificationOverlay } from "@/components/ui/MiaNotificationOverlay";

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
  metadataBase: new URL('https://momentum-finance.vercel.app'),
  title: {
    template: '%s | FINMOM OS',
    default: 'FINMOM | Inteligencia Financiera',
  },
  applicationName: 'FINMOM',
  description: 'Financial Health Command Center & AI Intelligence por M.I.A. Optimización asimétrica de tu patrimonio.',
  keywords: ["FINMOM", "Personal Finance", "AI Wealth Management", "Crypto Intelligence", "M.I.A AI"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FINMOM',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://momentum-finance.vercel.app',
    title: 'FINMOM Manager',
    description: 'Control total de tus finanzas personales y criptoactivos.',
    siteName: 'FINMOM',
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
import { SplashWrapper } from "@/components/ui/SplashWrapper";

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
                  <SplashWrapper>
                    {children}
                  </SplashWrapper>
                  <Toaster
                    theme="dark"
                    position="bottom-center"
                    toastOptions={{
                      style: {
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(16px)',
                      }
                    }}
                  />
                  <MiaNotificationOverlay />
                </CurrencyProvider>
              </ThemeProvider>
            </NativeSystemProvider>
          </QueryProvider>
        </InsforgeAuthProviders>
      </body>
    </html>
  );
}
