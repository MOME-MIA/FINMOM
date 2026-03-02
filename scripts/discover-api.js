/**
 * Discovers the InsForge Auth API endpoints
 */
const BASE_URL = "https://bhkij2c4.us-east.insforge.app";
const API_KEY = "ik_d4d759fee06503febc19773a5539cbda";

const PATHS_TO_TRY = [
    "/api/auth/sign-up",
    "/api/auth/signup",
    "/api/auth/register",
    "/api/users",
    "/api/auth/users",
    "/auth/sign-up",
    "/auth/signup",
    "/auth/register",
    "/v1/auth/sign-up",
    "/v1/auth/signup",
    "/v1/users",
    "/api/v1/auth/sign-up",
    "/api/v1/users",
];

async function discover() {
    console.log("=== InsForge API Route Discovery ===\n");

    for (const path of PATHS_TO_TRY) {
        try {
            const res = await fetch(`${BASE_URL}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify({
                    email: "probe@test.com",
                    password: "Test12345678!",
                }),
            });
            const text = await res.text();
            console.log(`${path} → ${res.status} ${text.substring(0, 120)}`);
        } catch (err) {
            console.log(`${path} → ERROR: ${err.message}`);
        }
    }
}

discover();
