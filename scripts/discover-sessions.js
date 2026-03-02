/**
 * Discover Session (Sign In) endpoints
 */
const BASE_URL = "https://bhkij2c4.us-east.insforge.app";
const API_KEY = "ik_d4d759fee06503febc19773a5539cbda";

const PATHS = [
    "/api/auth/sessions",
    "/api/auth/sign-in",
    "/api/auth/signin",
    "/api/auth/login",
    "/api/sessions",
];

async function discover() {
    console.log("=== Session Endpoint Discovery ===\n");

    // First, create a user via the working endpoint
    const testEmail = `e2e_${Date.now()}@momentum.test`;
    console.log(`Creating test user: ${testEmail}\n`);

    const signupRes = await fetch(`${BASE_URL}/api/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ email: testEmail, password: "TestPass2026!" }),
    });
    const signupData = await signupRes.text();
    console.log(`Sign-Up: ${signupRes.status} → ${signupData.substring(0, 200)}\n`);

    // Try to discover sign-in path
    for (const path of PATHS) {
        try {
            const res = await fetch(`${BASE_URL}${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify({ email: testEmail, password: "TestPass2026!" }),
            });
            const text = await res.text();
            const is404 = text.includes("Cannot POST");
            console.log(`${path} → ${res.status} ${is404 ? "(Not found)" : text.substring(0, 150)}`);
        } catch (err) {
            console.log(`${path} → ERROR: ${err.message}`);
        }
    }
}

discover();
