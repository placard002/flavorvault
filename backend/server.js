import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { seedIfEmpty } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'folio-dev-secret-key';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// ─── Auth helpers ──────────────────────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

function optionalAuth(req, res, next) {
  req.userId = null;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
    } catch {
      // invalid token — treat as anonymous
    }
  }
  next();
}

function requireAuth(req, res, next) {
  req.userId = null;
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }
    });
  }
}

// ─── Helper: build recipe list item ───────────────────────────────────────────
function formatRecipeRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    cuisine: row.cuisine,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    servings: row.servings,
    difficulty: row.difficulty,
    imageUrl: row.image_url,
    ingredientCount: parseInt(row.ingredient_count || 0, 10),
    isFavorited: row.is_favorited === true || row.is_favorited === 'true' || row.is_favorited === 1
  };
}

// ─── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
});

// ─── GET /api ──────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'Folio API',
    version: '1.0.0',
    description: 'Recipe discovery and management API for Folio',
    health: '/health',
    docs: '/docs',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/recipes',
      'GET  /api/recipes/:id',
      'GET  /api/favorites  (JWT)',
      'POST /api/favorites/:id  (JWT)',
      'DELETE /api/favorites/:id  (JWT)',
      'GET  /api/categories',
      'GET  /api/cuisines'
    ]
  });
});

// ─── GET /docs ─────────────────────────────────────────────────────────────────
app.get('/docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Folio API Docs</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f1117; color: #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; }
    a { color: #7dd3fc; }
    .sidebar { position: fixed; top: 0; left: 0; width: 240px; height: 100vh; background: #161b27; padding: 24px 16px; overflow-y: auto; border-right: 1px solid #1e293b; }
    .sidebar h2 { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 24px; }
    .sidebar a { display: block; padding: 6px 10px; border-radius: 6px; color: #94a3b8; font-size: 13px; text-decoration: none; margin-bottom: 2px; }
    .sidebar a:hover { background: #1e293b; color: #e2e8f0; }
    .main { margin-left: 240px; padding: 40px 48px; max-width: 900px; }
    h1 { font-size: 32px; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
    .tagline { color: #64748b; margin-bottom: 40px; font-size: 16px; }
    h2.section { font-size: 13px; font-weight: 600; color: #64748b; letter-spacing: .08em; text-transform: uppercase; margin: 48px 0 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
    .endpoint { background: #161b27; border: 1px solid #1e293b; border-radius: 10px; margin-bottom: 20px; overflow: hidden; }
    .ep-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #1a2133; }
    .badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: .04em; }
    .GET  { background: #0d3d2d; color: #34d399; }
    .POST { background: #1a2e52; color: #60a5fa; }
    .DELETE { background: #3b1f1f; color: #f87171; }
    .ep-path { font-family: monospace; font-size: 15px; color: #e2e8f0; }
    .ep-auth { margin-left: auto; font-size: 11px; color: #f59e0b; background: #2d2007; padding: 2px 8px; border-radius: 10px; }
    .ep-body { padding: 16px 20px; }
    .ep-body p { color: #94a3b8; font-size: 14px; margin-bottom: 12px; }
    pre { background: #0f1117; border: 1px solid #1e293b; border-radius: 6px; padding: 14px 16px; font-size: 13px; overflow-x: auto; color: #a5f3fc; line-height: 1.5; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #475569; margin: 12px 0 4px; font-weight: 600; }
    .pill { display: inline-block; font-size: 11px; background: #1e293b; color: #94a3b8; padding: 2px 8px; border-radius: 999px; margin-right: 4px; }
  </style>
</head>
<body>
<div class="sidebar">
  <h2>🍴 Folio API</h2>
  <a href="#auth">Authentication</a>
  <a href="#recipes">Recipes</a>
  <a href="#favorites">Favorites</a>
  <a href="#meta">Categories &amp; Cuisines</a>
</div>
<div class="main">
  <h1>Folio API</h1>
  <p class="tagline">REST API for the Folio recipe discovery platform — v1.0.0</p>
  <p>Base URL: <code style="color:#7dd3fc">https://your-domain.com/api</code> &nbsp;|&nbsp; Auth: <code style="color:#7dd3fc">Authorization: Bearer &lt;token&gt;</code></p>

  <h2 class="section" id="auth">Authentication</h2>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge POST">POST</span>
      <span class="ep-path">/api/auth/register</span>
    </div>
    <div class="ep-body">
      <p>Create a new user account and receive a JWT token.</p>
      <div class="label">Request Body</div>
      <pre>{ "email": "alice@example.com", "password": "hunter2", "name": "Alice" }</pre>
      <div class="label">Response 201</div>
      <pre>{ "success": true, "data": { "id": "uuid", "email": "alice@example.com", "name": "Alice", "token": "eyJ..." } }</pre>
      <div class="label">Response 409</div>
      <pre>{ "success": false, "error": { "code": "CONFLICT", "message": "Email already registered" } }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge POST">POST</span>
      <span class="ep-path">/api/auth/login</span>
    </div>
    <div class="ep-body">
      <p>Log in and receive a JWT token.</p>
      <div class="label">Request Body</div>
      <pre>{ "email": "alice@example.com", "password": "hunter2" }</pre>
      <div class="label">Response 200</div>
      <pre>{ "success": true, "data": { "id": "uuid", "email": "alice@example.com", "name": "Alice", "token": "eyJ..." } }</pre>
      <div class="label">Response 401</div>
      <pre>{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "Invalid email or password" } }</pre>
    </div>
  </div>

  <h2 class="section" id="recipes">Recipes</h2>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge GET">GET</span>
      <span class="ep-path">/api/recipes</span>
    </div>
    <div class="ep-body">
      <p>List all recipes with optional filters. Pass JWT to get personalised isFavorited flags.</p>
      <div class="label">Query Params</div>
      <span class="pill">search=pasta</span>
      <span class="pill">category=Baking</span>
      <span class="pill">cuisine=Italian</span>
      <span class="pill">ingredient=miso</span>
      <div class="label">curl Example</div>
      <pre>curl "https://your-domain.com/api/recipes?category=Baking&cuisine=French"</pre>
      <div class="label">Response 200</div>
      <pre>{ "success": true, "data": [
  {
    "id": "uuid", "title": "Honey Lavender Scones",
    "category": "Baking", "cuisine": "French",
    "prepTime": 20, "cookTime": 25, "servings": 8,
    "difficulty": "Easy",
    "imageUrl": "https://images.unsplash.com/...",
    "ingredientCount": 7,
    "isFavorited": false
  }
] }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge GET">GET</span>
      <span class="ep-path">/api/recipes/:id</span>
    </div>
    <div class="ep-body">
      <p>Fetch a single recipe with full ingredients and steps.</p>
      <div class="label">Response 200</div>
      <pre>{ "success": true, "data": {
  "id": "uuid", "title": "Miso Glazed Salmon",
  "ingredients": [{ "name": "Salmon fillets", "amount": "4", "unit": "170g each" }],
  "steps": [{ "number": 1, "instruction": "Whisk miso...", "imageUrl": null }],
  "isFavorited": true,
  "ingredientCount": 8
} }</pre>
      <div class="label">Response 404</div>
      <pre>{ "success": false, "error": { "code": "NOT_FOUND", "message": "Recipe not found" } }</pre>
    </div>
  </div>

  <h2 class="section" id="favorites">Favorites</h2>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge GET">GET</span>
      <span class="ep-path">/api/favorites</span>
      <span class="ep-auth">🔒 JWT required</span>
    </div>
    <div class="ep-body">
      <p>List all recipes the authenticated user has saved.</p>
    </div>
  </div>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge POST">POST</span>
      <span class="ep-path">/api/favorites/:id</span>
      <span class="ep-auth">🔒 JWT required</span>
    </div>
    <div class="ep-body">
      <p>Save a recipe to favorites. Idempotent — safe to call multiple times.</p>
      <div class="label">Response 200</div>
      <pre>{ "success": true }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge DELETE">DELETE</span>
      <span class="ep-path">/api/favorites/:id</span>
      <span class="ep-auth">🔒 JWT required</span>
    </div>
    <div class="ep-body">
      <p>Remove a recipe from favorites.</p>
      <div class="label">Response 200</div>
      <pre>{ "success": true }</pre>
    </div>
  </div>

  <h2 class="section" id="meta">Categories &amp; Cuisines</h2>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge GET">GET</span>
      <span class="ep-path">/api/categories</span>
    </div>
    <div class="ep-body">
      <p>Returns all recipe categories.</p>
      <div class="label">Response 200</div>
      <pre>{ "success": true, "data": ["Baking", "Cooking", "Desserts"] }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="ep-header">
      <span class="badge GET">GET</span>
      <span class="ep-path">/api/cuisines</span>
    </div>
    <div class="ep-body">
      <p>Returns all distinct cuisines from the recipes table.</p>
      <div class="label">Response 200</div>
      <pre>{ "success": true, "data": ["American", "Australian", "Eastern European", ...] }</pre>
    </div>
  </div>
</div>
</body>
</html>`);
});

// ─── POST /api/auth/register ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Valid email is required' } });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Password must be at least 6 characters' } });
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Name is required' } });
    }

    // Check for existing email
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Email already registered' } });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.query(
      'INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)',
      [id, email.toLowerCase(), name.trim(), passwordHash]
    );

    const token = signToken(id);
    return res.status(201).json({
      success: true,
      data: { id, email: email.toLowerCase(), name: name.trim(), token }
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Registration failed' } });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Email and password are required' } });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } });
    }

    const token = signToken(user.id);
    return res.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, token }
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Login failed' } });
  }
});

// ─── GET /api/recipes ──────────────────────────────────────────────────────────
app.get('/api/recipes', optionalAuth, async (req, res) => {
  try {
    const { search, category, cuisine, ingredient } = req.query;
    const userId = req.userId;

    const params = [];
    const conditions = [];
    let paramIdx = 1;

    if (search) {
      conditions.push(`(r.title ILIKE $${paramIdx} OR r.description ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (category) {
      conditions.push(`r.category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (cuisine) {
      conditions.push(`r.cuisine = $${paramIdx}`);
      params.push(cuisine);
      paramIdx++;
    }
    if (ingredient) {
      conditions.push(`EXISTS (
        SELECT 1 FROM ingredients i WHERE i.recipe_id = r.id AND i.name ILIKE $${paramIdx}
      )`);
      params.push(`%${ingredient}%`);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let favJoin = '';
    let favSelect = 'false AS is_favorited';
    if (userId) {
      favJoin = `LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = $${paramIdx}`;
      favSelect = 'CASE WHEN f.recipe_id IS NOT NULL THEN true ELSE false END AS is_favorited';
      params.push(userId);
      paramIdx++;
    }

    const sql = `
      SELECT r.*,
             COUNT(DISTINCT ing.id) AS ingredient_count,
             ${favSelect}
      FROM recipes r
      LEFT JOIN ingredients ing ON ing.recipe_id = r.id
      ${favJoin}
      ${whereClause}
      GROUP BY r.id ${userId ? ', f.recipe_id' : ''}
      ORDER BY r.created_at DESC
    `;

    const result = await db.query(sql, params);
    return res.json({ success: true, data: result.rows.map(formatRecipeRow) });
  } catch (err) {
    console.error('[GET /api/recipes]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch recipes' } });
  }
});

// ─── GET /api/recipes/:id ──────────────────────────────────────────────────────
app.get('/api/recipes/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    let favSelect = 'false AS is_favorited';
    const params = [id];

    if (userId) {
      favSelect = `EXISTS (
        SELECT 1 FROM favorites f WHERE f.recipe_id = r.id AND f.user_id = $2
      ) AS is_favorited`;
      params.push(userId);
    }

    const recipeResult = await db.query(
      `SELECT r.*,
              COUNT(DISTINCT ing.id) AS ingredient_count,
              ${favSelect}
       FROM recipes r
       LEFT JOIN ingredients ing ON ing.recipe_id = r.id
       WHERE r.id = $1
       GROUP BY r.id`,
      params
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Recipe not found' } });
    }

    const recipe = recipeResult.rows[0];

    const ingredientsResult = await db.query(
      'SELECT name, amount, unit FROM ingredients WHERE recipe_id = $1 ORDER BY sort_order ASC',
      [id]
    );

    const stepsResult = await db.query(
      'SELECT step_number AS number, instruction, image_url AS "imageUrl" FROM steps WHERE recipe_id = $1 ORDER BY step_number ASC',
      [id]
    );

    const formatted = formatRecipeRow(recipe);
    formatted.ingredients = ingredientsResult.rows;
    formatted.steps = stepsResult.rows;

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('[GET /api/recipes/:id]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch recipe' } });
  }
});

// ─── GET /api/favorites ────────────────────────────────────────────────────────
app.get('/api/favorites', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      `SELECT r.*,
              COUNT(DISTINCT ing.id) AS ingredient_count,
              true AS is_favorited
       FROM recipes r
       JOIN favorites fav ON fav.recipe_id = r.id
       LEFT JOIN ingredients ing ON ing.recipe_id = r.id
       WHERE fav.user_id = $1
       GROUP BY r.id
       ORDER BY fav.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows.map(formatRecipeRow) });
  } catch (err) {
    console.error('[GET /api/favorites]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch favorites' } });
  }
});

// ─── POST /api/favorites/:id ───────────────────────────────────────────────────
app.post('/api/favorites/:id', requireAuth, async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const userId = req.userId;

    // Check recipe exists
    const check = await db.query('SELECT id FROM recipes WHERE id = $1', [recipeId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Recipe not found' } });
    }

    // Insert, ignore conflicts (ON CONFLICT DO NOTHING)
    await db.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, recipeId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('[POST /api/favorites/:id]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to save favorite' } });
  }
});

// ─── DELETE /api/favorites/:id ─────────────────────────────────────────────────
app.delete('/api/favorites/:id', requireAuth, async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const userId = req.userId;

    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/favorites/:id]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to remove favorite' } });
  }
});

// ─── GET /api/categories ───────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    return res.json({ success: true, data: ['Baking', 'Cooking', 'Desserts'] });
  } catch (err) {
    console.error('[GET /api/categories]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch categories' } });
  }
});

// ─── GET /api/cuisines ─────────────────────────────────────────────────────────
app.get('/api/cuisines', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT cuisine FROM recipes ORDER BY cuisine ASC'
    );
    return res.json({ success: true, data: result.rows.map(r => r.cuisine) });
  } catch (err) {
    console.error('[GET /api/cuisines]', err);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cuisines' } });
  }
});

// ─── Serve frontend (dist/) ────────────────────────────────────────────────────
app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// ─── Startup ───────────────────────────────────────────────────────────────────
async function initSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
       id TEXT PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       name TEXT NOT NULL,
       password_hash TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE TABLE IF NOT EXISTS recipes (
       id TEXT PRIMARY KEY,
       title TEXT NOT NULL,
       description TEXT,
       category TEXT NOT NULL,
       cuisine TEXT NOT NULL,
       prep_time INTEGER,
       cook_time INTEGER,
       servings INTEGER,
       difficulty TEXT,
       image_url TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE TABLE IF NOT EXISTS ingredients (
       id TEXT PRIMARY KEY,
       recipe_id TEXT NOT NULL,
       name TEXT NOT NULL,
       amount TEXT,
       unit TEXT,
       sort_order INTEGER
     )`,
    `CREATE TABLE IF NOT EXISTS steps (
       id TEXT PRIMARY KEY,
       recipe_id TEXT NOT NULL,
       step_number INTEGER NOT NULL,
       instruction TEXT NOT NULL,
       image_url TEXT
     )`,
    `CREATE TABLE IF NOT EXISTS favorites (
       user_id TEXT NOT NULL,
       recipe_id TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       PRIMARY KEY (user_id, recipe_id)
     )`
  ];

  for (const sql of statements) {
    await db.query(sql);
  }
  console.log('[db] Schema ready');
}

async function start() {
  try {
    await initSchema();
    await seedIfEmpty();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[folio] Server running on http://0.0.0.0:${PORT}`);
      console.log(`[folio] Docs → http://0.0.0.0:${PORT}/docs`);
    });

    process.on('SIGTERM', () => {
      console.log('[folio] SIGTERM received, shutting down...');
      server.close(() => {
        console.log('[folio] Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('[folio] SIGINT received, shutting down...');
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error('[folio] Startup error:', err);
    process.exit(1);
  }
}

start();
