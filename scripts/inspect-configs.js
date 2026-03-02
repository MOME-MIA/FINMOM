const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
});

async function main() {
    await client.connect();

    // auth.configs columns
    console.log("=== auth.configs columns ===");
    const cols = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'configs'
        ORDER BY ordinal_position
    `);
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

    // auth.configs data
    console.log("\n=== auth.configs data ===");
    const data = await client.query("SELECT * FROM auth.configs LIMIT 5");
    data.rows.forEach(r => console.log(`  ${JSON.stringify(r)}`));

    // Also check the InsForge API config endpoint
    console.log("\n=== API Public Auth Config ===");
    const res = await fetch("https://bhkij2c4.us-east.insforge.app/api/auth/config", {
        headers: { "x-api-key": "ik_d4d759fee06503febc19773a5539cbda" },
    });
    const text = await res.text();
    console.log(`  Status: ${res.status} → ${text.substring(0, 300)}`);

    await client.end();
}

main().catch(console.error);
