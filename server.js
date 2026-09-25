const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'sai-homeo-super-secret-key'; // In production, use environment variables!

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files from current directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
});
const upload = multer({ storage: storage });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// API ROUTES
// ==========================================

// 1. Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      // Create token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '12h' });
      res.json({ token, username: user.username });
    });
  });
});

// 2. Create an Appointment (Public)
app.post('/api/appointments', (req, res) => {
  const { name, phone, condition, date, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and Phone are required' });

  const query = "INSERT INTO appointments (name, phone, condition, date, message, status) VALUES (?, ?, ?, ?, ?, 'pending')";
  db.run(query, [name, phone, condition, date || new Date().toISOString().split('T')[0], message || ''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Appointment created successfully' });
  });
});

// 3. Get All Appointments (Protected - Admin Only)
app.get('/api/appointments', authenticateToken, (req, res) => {
  db.all("SELECT * FROM appointments ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. Update Appointment Status (Protected - Admin Only)
app.put('/api/appointments/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  db.run("UPDATE appointments SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated successfully' });
  });
});

// 5. Get Settings (Public)
app.get('/api/settings', (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(row => settings[row.key] = row.value);
    res.json(settings);
  });
});

// 6. Upload Image (Protected - Admin Only)
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  
  const key = req.body.key; // e.g., 'home_image', 'doctor_image', 'why_us_image'
  if (!['home_image', 'doctor_image', 'why_us_image'].includes(key)) {
    return res.status(400).json({ error: 'Invalid setting key' });
  }

  const imagePath = 'uploads/' + req.file.filename;

  db.run("UPDATE settings SET value = ? WHERE key = ?", [imagePath, key], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Image updated successfully', imagePath });
  });
});

// 7. Get Gallery Images (Public)
app.get('/api/gallery', (req, res) => {
  db.all("SELECT * FROM gallery ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 8. Upload Gallery Image (Protected - Admin Only, Max 20)
app.post('/api/gallery', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  // Check if limit is reached
  db.get("SELECT COUNT(*) as count FROM gallery", [], (err, row) => {
    if (err) {
      fs.unlink(req.file.path, () => {});
      return res.status(500).json({ error: err.message });
    }
    
    if (row.count >= 20) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Maximum limit of 20 images reached.' });
    }

    const imagePath = 'uploads/' + req.file.filename;

    db.run("INSERT INTO gallery (image_path) VALUES (?)", [imagePath], function(err) {
      if (err) {
        fs.unlink(req.file.path, () => {});
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, imagePath, message: 'Image added to gallery' });
    });
  });
});

// 9. Delete Gallery Image (Protected - Admin Only)
app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT image_path FROM gallery WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Image not found' });

    db.run("DELETE FROM gallery WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const filePath = path.join(__dirname, row.image_path);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
      });

      res.json({ message: 'Image deleted successfully' });
    });
  });
});


// 10. Increment Visitor Count (Public)
app.post('/api/visitor-count', (req, res) => {
  db.get("SELECT value FROM settings WHERE key = 'visitor_count'", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    let count = parseInt(row?.value || '0', 10) + 1;
    db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('visitor_count', ?)", [count.toString()], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count });
    });
  });
});

// Fallback for SPA routing - Serve index.html or admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
