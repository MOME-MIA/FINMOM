const { Client } = require("pg");
const BASE_URL = "https://bhkij2c4.us-east.insforge.app";
const API_KEY = "ik_d4d759fee06503febc19773a5539cbda";

const client = new Client({
    connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
});

const TEST_EMAIL = `fulltest_${Date.now()}@momentum.dev`;
const TEST_PASSWORD = "MomentumTest2026!";

async function main() {
    await client.connect();

    // Step 1: Disable email verification
    console.log("1. Disabling email verification...");
    await client.query("UPDATE auth.configs SET require_email_verification = false");
    console.log("   ✅ Done\n");

    // Step 2: Sign Up
    console.log(`2. Sign Up (${TEST_EMAIL})...`);
    const signupRes = await fetch(`${BASE_URL}/api/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });
    const signupData = await signupRes.json();
    console.log(`   Status: ${signupRes.status} ${signupRes.ok ? "✅" : "❌"}`);
    console.log(`   Data: ${JSON.stringify(signupData)}\n`);

    // Step 3: Sign In
    console.log(`3. Sign In (${TEST_EMAIL})...`);
    const signinRes = await fetch(`${BASE_URL}/api/auth/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });
    const signinData = await signinRes.json();
    console.log(`   Status: ${signinRes.status} ${signinRes.ok ? "✅" : "❌"}`);
    console.log(`   Has accessToken: ${!!signinData.accessToken}`);
    console.log(`   User ID: ${signinData.user?.id || "N/A"}\n`);

    // Step 4: Verify profile was auto-created via trigger
    console.log("4. Checking auto-created profile...");
    const profileRes = await client.query(
        "SELECT id, email, display_name, subscription_tier FROM public.profiles WHERE email = $1",
        [TEST_EMAIL]
    );
    if (profileRes.rows.length > 0) {
        console.log(`   ✅ Profile exists: ${JSON.stringify(profileRes.rows[0])}`);
    } else {
        console.log("   ⚠️ Profile NOT found. Checking auth.users...");
        const authRes = await client.query("SELECT id, email FROM auth.users WHERE email = $1", [TEST_EMAIL]);
        console.log(`   Auth user: ${authRes.rows.length > 0 ? JSON.stringify(authRes.rows[0]) : "NOT FOUND"}`);
    }

    // Step 5: Count total users
    console.log("\n5. Total registered users:");
    const countAuth = await client.query("SELECT COUNT(*) FROM auth.users");
    const countProfiles = await client.query("SELECT COUNT(*) FROM public.profiles");
    console.log(`   auth.users: ${countAuth.rows[0].count}`);
    console.log(`   public.profiles: ${countProfiles.rows[0].count}`);

    console.log("\n=== Full E2E Auth Test Complete ===");
    await client.end();
}

main().catch(console.error);
