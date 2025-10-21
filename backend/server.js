// server.js (backend)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const SECRET = process.env.JWT_SECRET || 'luxevoyage_dev_secret';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin_secret_code';
const PORT = process.env.PORT || 4000;

const app = express();
// Allow Vite dev server ports (5173/5174) and other localhost origins during development
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
app.use(cors({ origin: (origin, cb) => { if(!origin) return cb(null, true); cb(null, allowedOrigins.includes(origin)); }, credentials: true }));
app.use(bodyParser.json());

// morgan for better request logging
app.use(morgan('dev'));

// Simple request logger so incoming requests appear in the server console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const DBSOURCE = path.join(__dirname, 'luxevoyage.db');
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) { console.error('DB open error', err); process.exit(1); }
  console.log('Connected to SQLite DB');
});

// Initialize tables & seed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, description TEXT, price REAL, image TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, price REAL, rating REAL, image TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, review TEXT, rating INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, tour_id INTEGER, hotel_id INTEGER, date TEXT, guests INTEGER, type TEXT, status TEXT DEFAULT 'confirmed', created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, service TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // default admin
  db.get(`SELECT * FROM users WHERE email = ?`, ['admin@luxevoyage.com'], (err, row) => {
    if (!row) {
      bcrypt.hash('Admin@123', 10).then(hash => {
        db.run(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`, ['Admin', 'admin@luxevoyage.com', hash, 'admin']);
        console.log('Created default admin: admin@luxevoyage.com / Admin@123');
      });
    }
  });

  // seed tours if empty (use placeholder image paths; admin can paste Google URLs later)
  db.get(`SELECT COUNT(*) as c FROM tours`, (e, r) => {
    if (r && r.c === 0) {
      const s = db.prepare(`INSERT INTO tours (city,description,price,image) VALUES (?,?,?,?)`);
      s.run('New York', '5 days — curated city experience', 399, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
      s.run('Paris', 'Romantic Seine & culinary delights', 299, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34');
      s.run('Tokyo', 'Culinary & cultural private tours', 449, 'https://images.unsplash.com/photo-1526481280698-6f63b0b5a6e2');
        // extra seeds
        s.run('Sydney', 'Harbourfront luxury experiences', 379, 'https://images.unsplash.com/photo-1506976785307-8732e854ad0f');
        s.run('Rome', 'History, art and fine dining', 329, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade');
        s.run('Bali', 'Relaxing island escapes & wellness', 459, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e');
    s.run('Istanbul', 'East meets West cultural exploration', 349, 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0');
    s.run('Cape Town', 'Coastal vistas & vineyard tours', 389, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e');
    s.run('Reykjavik', 'Northern lights & glacier adventures', 599, 'https://images.unsplash.com/photo-1519681393784-d120267933ba');
    s.run('Marrakech', 'Markets, riads and desert escapes', 289, 'https://images.unsplash.com/photo-1508261301704-73c4a7b6b1f0');
    s.run('Lisbon', 'Coastal charm and history', 279, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
    s.run('Dubai', 'Luxury shopping and desert experiences', 699, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade');
  // 20 more tour seeds (diverse destinations)
  s.run('Santorini', 'Whitewashed cliffside luxury', 419, 'https://images.unsplash.com/photo-1506801310323-534be5e7d3e6');
  s.run('Prague', 'Historic old town and castle tours', 289, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Amsterdam', 'Canal cruises and art museums', 339, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Bangkok', 'Street food and temples', 249, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Los Angeles', 'Coastal drives and entertainment', 379, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('San Francisco', 'Golden Gate & wine country', 399, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Berlin', 'History, nightlife & culture', 299, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Seoul', 'K-pop, food and markets', 429, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Vienna', 'Classical music and palaces', 309, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Quebec', 'Charming old city escapes', 279, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Hanoi', 'Riverside culture and street food', 239, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Milan', 'Fashion, design and dining', 349, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Iguazu', 'Waterfalls and jungle lodges', 549, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Buenos Aires', 'Tango, steak houses and culture', 329, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Helsinki', 'Design, saunas and islands', 319, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Zurich', 'Alpine proximity & banking', 459, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Edinburgh', 'Castles and festivals', 289, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Krakow', 'Medieval charm and history', 259, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Zanzibar', 'Tropical beaches and spice tours', 429, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
  s.run('Buenos Aires', 'Cultural city and tango nights', 319, 'https://images.unsplash.com/photo-1505765059731-8d4f7b9d0f9b');
      s.finalize();
    }
  });

  db.get(`SELECT COUNT(*) as c FROM hotels`, (e,r) => {
    if (r && r.c === 0) {
      const s = db.prepare(`INSERT INTO hotels (name,location,price,rating,image) VALUES (?,?,?,?,?)`);
      s.run('Sarino Hotel','City Center',150,4.4,'https://images.unsplash.com/photo-1501117716987-c8e0f7a8e2bb');
      s.run('Cliffside Resort','Beachfront',320,4.8,'https://images.unsplash.com/photo-1501117716987-c8e0f7a8e2bb');
      s.run('Alpine Chalet','Mountain',220,4.6,'https://images.unsplash.com/photo-1519821172141-b0b8b7a6f8fa');
        // extra seed hotels
        s.run('Grand Aurora','Old Town',200,4.5,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
        s.run('Seabreeze Suites','Waterfront',280,4.7,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
        s.run('Zen Retreat','Island',340,4.9,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Harborview Plaza','Seaside',260,4.3,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Mountain Vista','Highlands',190,4.2,'https://images.unsplash.com/photo-1519821172141-b0b8b7a6f8fa');
    s.run('City Grand','Downtown',210,4.0,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    // 20 more hotels
    s.run('Azure Suites','Seafront',310,4.6,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Old Town Inn','Historic',140,4.1,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Harbour Loft','Waterfront',240,4.4,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Palazzo Royale','City Center',420,4.9,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Riverside Hotel','Riverside',190,4.0,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Boutique Maison','Quarter',260,4.5,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Lagoon Resort','Beach',380,4.8,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Skyline Hotel','Downtown',330,4.3,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Canyon Lodge','National Park',170,4.2,'https://images.unsplash.com/photo-1519821172141-b0b8b7a6f8fa');
    s.run('Palmetto Resort','Island',290,4.6,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('The Conservatory','Garden View',220,4.1,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('The Atrium','Modern',270,4.4,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Harbor Kings','Seaside',300,4.2,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Crestwood Resort','Hillside',250,4.5,'https://images.unsplash.com/photo-1519821172141-b0b8b7a6f8fa');
    s.run('The Beacon','Lighthouse',190,4.0,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Marina Plaza','Marina',310,4.7,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('The Gables','Countryside',160,4.3,'https://images.unsplash.com/photo-1519821172141-b0b8b7a6f8fa');
    s.run('Opera Suites','Near Opera',290,4.6,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
    s.run('Harbor View Inn','Seafront',230,4.2,'https://images.unsplash.com/photo-1496412705862-e0088f16f791');
    s.run('Palace Rooftop','Luxury',480,4.9,'https://images.unsplash.com/photo-1505691723518-34f6ad7d4b11');
      s.finalize();
    }
  });

  db.get(`SELECT COUNT(*) as c FROM testimonials`, (e,r) => {
    if (r && r.c === 0) {
      const s = db.prepare(`INSERT INTO testimonials (name,review,rating) VALUES (?,?,?)`);
      s.run('Sarah P.','Amazing luxury escape with perfect service.',5);
      s.run('James L.','Top-tier guides and flawless planning.',5);
      s.finalize();
    }
  });
});

// Auth middleware
function verifyToken(req, res, next) {
  try {
    const h = req.headers['authorization'] || req.headers['Authorization'];
    if (!h) return res.status(401).json({ error: 'Missing Authorization header' });
    const parts = h.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return res.status(401).json({ error: 'Malformed Authorization header' });
    const token = parts[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(401).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(500).json({ error: 'Token verification failed' });
  }
}
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  next();
}

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  await body('name').notEmpty().run(req);
  await body('email').isEmail().run(req);
  await body('password').isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  const { name, email, password, adminCode } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    // determine role: if adminCode matches ADMIN_KEY, grant admin role
    const role = adminCode && adminCode === ADMIN_KEY ? 'admin' : 'user';
    db.run(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`, [name, email, hash, role], function(err) {
      if (err) return res.status(400).json({ error: 'Email likely exists' });
      const user = { id: this.lastID, name, email, role };
  const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
    res.json({ user: payload, token });
  });
});

// Tours
app.get('/api/v1/tours', (req, res) => {
  db.all(`SELECT * FROM tours ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, image: r.image || '' })));
  });
});
app.post('/api/v1/tours', verifyToken, isAdmin, (req, res) => {
  // validate inputs
  const { city, description, price, image } = req.body;
  if (!city) return res.status(400).json({ error: 'City required' });
  db.run(`INSERT INTO tours (city,description,price,image) VALUES (?,?,?,?)`, [city, description, price, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, city, description, price, image });
  });
});
app.put('/api/v1/tours/:id', verifyToken, isAdmin, (req, res) => {
  const { city, description, price, image } = req.body;
  const { id } = req.params;
  db.run(`UPDATE tours SET city=?, description=?, price=?, image=? WHERE id=?`, [city, description, price, image, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});
app.delete('/api/v1/tours/:id', verifyToken, isAdmin, (req, res) => {
  db.run(`DELETE FROM tours WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Hotels
app.get('/api/v1/hotels', (req, res) => {
  db.all(`SELECT * FROM hotels ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, image: r.image || '' })));
  });
});
app.post('/api/v1/hotels', verifyToken, isAdmin, (req, res) => {
  const { name, location, price, rating, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  db.run(`INSERT INTO hotels (name,location,price,rating,image) VALUES (?,?,?,?,?)`, [name, location, price, rating, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, location, price, rating, image });
  });
});
app.put('/api/v1/hotels/:id', verifyToken, isAdmin, (req, res) => {
  const { name, location, price, rating, image } = req.body;
  db.run(`UPDATE hotels SET name=?, location=?, price=?, rating=?, image=? WHERE id=?`, [name, location, price, rating, image, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});
app.delete('/api/v1/hotels/:id', verifyToken, isAdmin, (req, res) => {
  db.run(`DELETE FROM hotels WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Testimonials
app.get('/api/v1/testimonials', (req, res) => {
  db.all(`SELECT * FROM testimonials ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/v1/testimonials', verifyToken, (req, res) => {
  const { name, review, rating } = req.body;
  db.run(`INSERT INTO testimonials (name,review,rating) VALUES (?,?,?)`, [name, review, rating], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, review, rating });
  });
});

// Bookings (tour)
app.post('/api/v1/bookings', verifyToken, (req, res) => {
  const { tour_id, guests, date } = req.body;
  if (!tour_id || !date) return res.status(400).json({ error: 'Missing fields' });
  db.run(`INSERT INTO bookings (user_id,tour_id,date,guests,type) VALUES (?,?,?,?,?)`, [req.user.id, tour_id, date, guests||1, 'tour'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
// Bookings (hotel)
app.post('/api/v1/bookings/hotel', verifyToken, (req, res) => {
  const { hotel_id, guests, date } = req.body;
  if (!hotel_id || !date) return res.status(400).json({ error: 'Missing fields' });
  db.run(`INSERT INTO bookings (user_id,hotel_id,date,guests,type) VALUES (?,?,?,?,?)`, [req.user.id, hotel_id, date, guests||1, 'hotel'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
// Get bookings (role-based)
app.get('/api/v1/bookings', verifyToken, (req, res) => {
  let query = 'SELECT * FROM bookings';
  const params = [];
  if (req.user.role !== 'admin') {
    query += ' WHERE user_id = ?';
    params.push(req.user.id);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const p = rows.map(b => new Promise(resolve => {
      if (b.tour_id) db.get('SELECT city as name FROM tours WHERE id=?', [b.tour_id], (e, r) => { b.name = r ? r.name : 'Tour'; resolve(); });
      else if (b.hotel_id) db.get('SELECT name FROM hotels WHERE id=?', [b.hotel_id], (e, r) => { b.name = r ? r.name : 'Hotel'; resolve(); });
      else resolve();
    }));
    Promise.all(p).then(()=> res.json(rows));
  });
});

// Contacts
app.post('/api/v1/contacts', (req, res) => {
  const { name, email, service, message } = req.body;
  if (!name || !email || !service) return res.status(400).json({ error: 'Missing fields' });
  db.run(`INSERT INTO contacts (name,email,service,message) VALUES (?,?,?,?)`, [name, email, service, message], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Serve static assets (if you want to host hero video from backend/public)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// If a built frontend exists in ../frontend/dist, serve it as static files so a single
// backend process can serve both API and the web app in production-like setups.
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // For any non-API route, serve index.html so client-side routing works
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Health / root endpoint to quickly verify server is responding
app.get('/', (req, res) => res.send('Luxevoyage backend running'));

// Global error handlers to catch unexpected crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// start - bind to 0.0.0.0 explicitly for Windows/dev environments
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT} (bound to 0.0.0.0)`);
});
