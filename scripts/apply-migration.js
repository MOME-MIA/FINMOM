const fs = require('fs');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true';

const client = new Client({ connectionString });

async function applyMigrations() {
    try {
        const sql = fs.readFileSync('insforge/schema.sql', 'utf8');
        await client.connect();

        // Begin transaction
        await client.query('BEGIN');

        try {
            console.log('Running schema definitions...');
            await client.query(sql);
            await client.query('COMMIT');
            console.log('Migration successfully applied!');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
    } catch (err) {
        console.error('Migration error', err.stack);
    } finally {
        await client.end();
    }
}

applyMigrations();
