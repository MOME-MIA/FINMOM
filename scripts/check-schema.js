const { Client } = require('pg');

const connectionString = 'postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require&uselibpqcompat=true';

const client = new Client({ connectionString });

async function checkSchema() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('auth', 'public')
    `);
        console.log('Tables:', res.rows);
    } catch (err) {
        console.error('Connection error', err.stack);
    } finally {
        await client.end();
    }
}

checkSchema();
