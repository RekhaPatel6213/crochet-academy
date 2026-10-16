import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

let pool = null;
let isMySQLConnected = false;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crochet_academy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  isMySQLConnected = true;
  console.log(`🐬 [MySQL] Successfully connected to '${process.env.DB_NAME || 'crochet_academy'}' at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
} catch (err) {
  isMySQLConnected = false;
  console.warn(`⚠️ [MySQL] Could not connect to MySQL: ${err.message}. Running with JSON fallback.`);
}

export { pool, isMySQLConnected };

// Helper to safely parse JSON field from MySQL row
export function safeJson(val, fallback = null) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}
