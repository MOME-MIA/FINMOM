import { InsforgeMiddleware } from "@insforge/nextjs/middleware";

export default InsforgeMiddleware({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "",
    publicRoutes: [
        "/",
        "/login",
        "/mom-capital",
        "/api/auth",
        "/api/auth/(.*)"
    ],
    signInUrl: "/login",
    afterSignInUrl: "/dashboard",
    useBuiltInAuth: false,
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
