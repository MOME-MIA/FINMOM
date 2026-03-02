const { Client } = require('pg');

const connectionString = 'postgresql://postgres:99fadd3dbde71c4164af66dc91fabb2b@bhkij2c4.us-east.database.insforge.app:5432/insforge?sslmode=require';

const client = new Client({
    connectionString,
});

async function checkConnection() {
    try {
        await client.connect();
        console.log('Successfully connected to InsForge PostgreSQL database!');
        const res = await client.query('SELECT NOW()');
        console.log('Current time from DB:', res.rows[0]);

        // Check existing tables
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Existing public tables:', tables.rows);
    } catch (err) {
        console.error('Connection error', err.stack);
    } finally {
        await client.end();
    }
}

checkConnection();
