/**
 * E2E Auth Validation Script
 * Tests InsForge SignUp and SignIn directly via the REST API
 */

const BASE_URL = "https://bhkij2c4.us-east.insforge.app";
const API_KEY = "ik_d4d759fee06503febc19773a5539cbda";

const TEST_EMAIL = `test_${Date.now()}@momentum.dev`;
const TEST_PASSWORD = "TestMomentum2026!";

async function apiCall(path, method = "GET", body = null) {
    const opts = {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE_URL}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
}

async function runTests() {
    console.log("=== InsForge Auth E2E Tests ===\n");

    // 1. Health Check
    console.log("1. Health Check...");
    const health = await apiCall("/api/health");
    console.log(`   Status: ${health.status} ${health.ok ? "✅" : "❌"}`);
    if (health.data) console.log(`   Data: ${JSON.stringify(health.data)}`);

    // 2. Sign Up
    console.log(`\n2. Sign Up (${TEST_EMAIL})...`);
    const signUp = await apiCall("/api/auth/sign-up", "POST", {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
    });
    console.log(`   Status: ${signUp.status} ${signUp.ok ? "✅" : "❌"}`);
    if (signUp.data) console.log(`   Response: ${JSON.stringify(signUp.data).substring(0, 200)}`);

    // 3. Sign In
    console.log(`\n3. Sign In (${TEST_EMAIL})...`);
    const signIn = await apiCall("/api/auth/sign-in", "POST", {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
    });
    console.log(`   Status: ${signIn.status} ${signIn.ok ? "✅" : "❌"}`);
    if (signIn.data) console.log(`   Response: ${JSON.stringify(signIn.data).substring(0, 200)}`);

    // 4. Check if profile was auto-created via trigger
    const { Client } = require("pg");
    const client = new Client({
        connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
    });

    console.log(`\n4. DB Profile check for ${TEST_EMAIL}...`);
    try {
        await client.connect();
        const res = await client.query("SELECT id, email, display_name, subscription_tier FROM public.profiles WHERE email = $1", [TEST_EMAIL]);
        if (res.rows.length > 0) {
            console.log(`   ✅ Profile auto-created: ${JSON.stringify(res.rows[0])}`);
        } else {
            console.log(`   ⚠️ No profile found (trigger may not have fired yet or InsForge auth schema differs)`);
        }

        // 5. Check auth.users
        console.log(`\n5. Auth users check...`);
        const authRes = await client.query("SELECT id, email FROM auth.users WHERE email = $1", [TEST_EMAIL]);
        if (authRes.rows.length > 0) {
            console.log(`   ✅ Auth user exists: ${JSON.stringify(authRes.rows[0])}`);
        } else {
            console.log(`   ⚠️ No auth user found for ${TEST_EMAIL}`);
        }
    } catch (err) {
        console.error(`   ❌ DB Error: ${err.message}`);
    } finally {
        await client.end();
    }

    console.log("\n=== Tests Complete ===");
}

runTests().catch(console.error);
