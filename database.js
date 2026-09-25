const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'clinic.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`, (err) => {
      if (!err) {
        // Seed an admin user if not exists
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
          if (!row) {
            const saltRounds = 10;
            bcrypt.hash('admin123', saltRounds, (err, hash) => {
              if (!err) {
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash]);
                console.log('Default admin user created. (username: admin, password: admin123)');
              }
            });
          }
        });
      }
    });

    // Create appointments table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      condition TEXT,
      date TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )`, (err) => {
      if (!err) {
        // Initialize default images
        const defaultSettings = [
          ['home_image', 'assets/clinic-front.jpg'],
          ['doctor_image', 'assets/doctor-amit-singh.jpg'],
          ['why_us_image', 'assets/remedies.jpg'],
          ['visitor_count', '0']
        ];
        
        defaultSettings.forEach(([key, value]) => {
          db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", [key, value]);
        });
      }
    });

    // Create gallery table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;
