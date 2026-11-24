const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
require('dotenv').config();

let pool;

const USE_SQLITE = !process.env.DB_HOST || process.env.DB_HOST === 'sqlite';

if (USE_SQLITE) {
  const db = new Database('simona.db');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      upt TEXT DEFAULT '000111',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tb_satker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kd_satker TEXT,
      nama_satker TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tb_spm_program (
      id_spm_program INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_upt TEXT,
      bulan TEXT,
      tahun_anggaran TEXT,
      is_active TEXT DEFAULT '1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tb_spm_kegiatan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_spm_program INTEGER,
      kd_unit TEXT,
      nama_upt TEXT,
      kode_kegiatan TEXT,
      nama_kegiatan TEXT,
      pagu_revisi REAL DEFAULT 0,
      realisasi_sd_periode REAL DEFAULT 0,
      sisa_anggaran REAL DEFAULT 0,
      upt_id TEXT,
      bulan TEXT,
      tahun_anggaran TEXT,
      is_active TEXT DEFAULT '1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pool = {
    execute: async (sql, params = []) => {
      const stmt = db.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return [stmt.all(...params)];
      } else {
        const result = stmt.run(...params);
        return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
      }
    },
    query: async (sql, params = []) => {
      const stmt = db.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return [stmt.all(...params)];
      } else {
        const result = stmt.run(...params);
        return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
      }
    }
  };
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;
