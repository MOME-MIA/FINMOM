const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
});

async function disableEmailVerification() {
    await client.connect();

    // Check current auth config
    console.log("=== Current auth configs ===");
    const configs = await client.query("SELECT key, value FROM auth.configs");
    configs.rows.forEach(r => console.log(`  ${r.key} = ${r.value}`));

    // Disable email verification
    console.log("\nDisabling email verification...");
    const result = await client.query(`
        UPDATE auth.configs SET value = 'false' WHERE key = 'requireEmailVerification'
    `);
    if (result.rowCount === 0) {
        console.log("Key not found. Inserting...");
        await client.query(`
            INSERT INTO auth.configs (key, value) VALUES ('requireEmailVerification', 'false')
            ON CONFLICT (key) DO UPDATE SET value = 'false'
        `);
    }
    console.log("✅ Email verification disabled");

    // Verify
    const verify = await client.query("SELECT key, value FROM auth.configs WHERE key = 'requireEmailVerification'");
    console.log(`\nVerification: ${JSON.stringify(verify.rows)}`);

    await client.end();
}

disableEmailVerification().catch(console.error);
