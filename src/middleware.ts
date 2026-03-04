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

export async function middleware(req: NextRequest) {
    // 1. Ejecutar el orquestador base y permitir refresco de cookies
    const res = await InsforgeMiddleware({
        baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "",
        publicRoutes: [
            "/",
            "/login",
            "/mom-capital",
            "/pricing",
            "/api/auth",
            "/api/auth/(.*)"
        ],
        signInUrl: "/login",
        afterSignInUrl: "/dashboard",
        useBuiltInAuth: false,
    })(req);

    // Si ya existe una redirección exigida por auth (ej. login redirect), obedecemos:
    if (res.status === 307 || res.status === 308) {
        return res;
    }

    // 2. ENJAULAR MEDIANTE MIDDLEWARE - LÓGICA DE WAITLIST
    const isPublicRoute = [
        "/",
        "/login",
        "/mom-capital",
        "/pricing"
    ].includes(req.nextUrl.pathname) || req.nextUrl.pathname.startsWith("/api/auth");

    if (!isPublicRoute) {
        // En este punto, sabemos que InsforgeMiddleware detectó una sesión (no hubo redirect).
        // Extraemos el JWT desde la cookie principal para revisar la identidad.
        // Las cookies de InsForge pueden variar, revisamos la de la sesión (access token):
        const tokenCookie = req.cookies.get('insforge-auth-token')?.value ||
            req.cookies.get('sb-auth-token')?.value ||
            req.cookies.get('auth_token')?.value;

        if (tokenCookie) {
            const payload = parseJwt(tokenCookie);
            const email = payload?.email?.toLowerCase() || "";

            // Pasaporte Blanco: Admins siempre entran para gestionar el panel
            if (email && email.includes("agenciamom.contacto")) {
                return res;
            }

            if (email) {
                // Verificamos estado en Waitlist usando fetch Nativo (compatible con Edge)
                // Usamos el JWT del propio usuario en el Bearer para cumplir con políticas RLS de lectura de InsForge
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
                        // RECHAZADO: Redirigimos al calabozo de espera
                        const url = req.nextUrl.clone();
                        url.pathname = '/login';
                        url.searchParams.set('waitlist', 'pending');
                        return NextResponse.redirect(url);
                    }
                } catch (edgeError) {
                    console.error("[Middleware] Error comprobando Waitlist en Edge:", edgeError);
                    // Por seguridad en caso de fallo DB, bloqueamos el acceso.
                    const url = req.nextUrl.clone();
                    url.pathname = '/login';
                    url.searchParams.set('waitlist', 'system_error');
                    return NextResponse.redirect(url);
                }
            }
        }
    }

    return res;
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
