import pg from 'pg';
import { config } from 'dotenv';
config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_DB_PORT,
    database: process.env.POSTGRES_DATABASE
});

export default pool;