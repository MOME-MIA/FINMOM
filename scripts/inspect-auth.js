const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
});

async function main() {
    await client.connect();

    // 1. Inspect auth.users columns
    console.log("=== auth.users columns ===");
    const cols = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'users'
        ORDER BY ordinal_position
    `);
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}, nullable: ${r.is_nullable})`));

    // 2. Inspect existing triggers on auth.users
    console.log("\n=== Triggers on auth.users ===");
    const trig = await client.query(`
        SELECT trigger_name, event_manipulation, action_statement
        FROM information_schema.triggers
        WHERE event_object_schema = 'auth' AND event_object_table = 'users'
    `);
    trig.rows.forEach(r => console.log(`  ${r.trigger_name} (${r.event_manipulation}): ${r.action_statement}`));

    await client.end();
}

main().catch(console.error);
