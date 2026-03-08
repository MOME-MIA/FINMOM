import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { InsforgeMiddleware } from "@insforge/nextjs/middleware";

// Función utilitaria ligera para decodificar JWT en Edge (sin dependencias extra)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = atob(base64);
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
}

// All marketing/public pages that don't require authentication
const PUBLIC_PATHS = new Set([
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/mom-capital",
    "/pricing",
    "/pricing/success",
    "/features",
    "/mia",
    "/about",
    "/contact",
    "/security",
    "/careers",
    "/changelog",
    "/privacy",
    "/terms",
    "/licenses",
    "/compare",
    "/sandbox",
    "/status",
    "/help-center",
]);

const PUBLIC_PREFIXES = [
    "/api/auth",
    "/solutions",
];

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_PATHS.has(pathname)) return true;
    return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. SHORT-CIRCUIT: If it's a public/marketing route, let it through immediately
    //    without any auth checks. No login required for these pages.
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // 2. For protected routes (dashboard, settings, etc.), run InsforgeMiddleware
    const res = await InsforgeMiddleware({
        baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "",
        publicRoutes: ["/", "/login", "/register", "/forgot-password"],
        signInUrl: "/login",
        afterSignInUrl: "/dashboard",
        useBuiltInAuth: false,
    })(req);

    // Si InsforgeMiddleware exige redirect (no autenticado), obedecemos:
    if (res.status === 307 || res.status === 308) {
        return res;
    }

    // 3. WAITLIST GATE — Solo para rutas protegidas (dashboard, etc.)
    const tokenCookie = req.cookies.get('insforge-auth-token')?.value ||
        req.cookies.get('sb-auth-token')?.value ||
        req.cookies.get('auth_token')?.value;

    if (tokenCookie) {
        const payload = parseJwt(tokenCookie);
        const email = payload?.email?.toLowerCase() || "";

        // Pasaporte Blanco: Admins siempre entran
        if (email && email.includes("agenciamom.contacto")) {
            return res;
        }

        if (email) {
            try {
                const waitlistRes = await fetch(
                    `${process.env.NEXT_PUBLIC_INSFORGE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=status`,
                    {
                        headers: {
                            "apikey": process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "",
                            "Authorization": `Bearer ${tokenCookie}`,
                        },
                    }
                );

                const waitlistData = await waitlistRes.json();
                const isApproved = waitlistData && waitlistData.length > 0 && waitlistData[0].status === 'approved';

                if (!isApproved) {
                    const url = req.nextUrl.clone();
                    url.pathname = '/login';
                    url.searchParams.set('waitlist', 'pending');
                    return NextResponse.redirect(url);
                }
            } catch (edgeError) {
                console.error("[Middleware] Error comprobando Waitlist en Edge:", edgeError);
                const url = req.nextUrl.clone();
                url.pathname = '/login';
                url.searchParams.set('waitlist', 'system_error');
                return NextResponse.redirect(url);
            }
        }
    }

    return res;
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
