import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';

let db;

if (process.env.DATABASE_URL) {
  // Strip sslmode and other query params, add ssl option manually
  const connStr = process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
  const pool = new pg.Pool({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  db = {
    query: (sql, params) => pool.query(sql, params)
  };
  console.log('[db] Using Postgres (pg.Pool)');
} else {
  const pglite = new PGlite('/tmp/pglite-data');
  db = {
    query: async (sql, params) => {
      const result = await pglite.query(sql, params);
      return { rows: result.rows };
    }
  };
  console.log('[db] Using PGlite at /tmp/pglite-data');
}

export default db;
