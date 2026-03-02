const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true",
});

async function fix() {
    await client.connect();

    console.log("Fixing handle_new_user trigger...");
    await client.query(`
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, email, display_name)
            VALUES (
                NEW.id,
                NEW.email,
                COALESCE(NEW.profile->>'full_name', split_part(NEW.email, '@', 1))
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log("✅ Trigger function fixed (uses NEW.profile instead of raw_user_meta_data)");

    await client.end();
}

fix().catch(console.error);
