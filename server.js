require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { User, Appointment, Setting, Gallery } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'sai-homeo-super-secret-key'; // In production, use environment variables!

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
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '12h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create an Appointment (Public)
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, phone, condition, date, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and Phone are required' });

    const appointment = await Appointment.create({
      name,
      phone,
      condition,
      date: date || new Date().toISOString().split('T')[0],
      message: message || '',
      status: 'pending'
    });
    
    res.json({ id: appointment._id, message: 'Appointment created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Appointments (Protected - Admin Only)
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ created_at: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Appointment Status (Protected - Admin Only)
app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(id, { status });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Settings (Public)
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await Setting.find();
    const settings = {};
    rows.forEach(row => settings[row.key] = row.value);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Upload Image (Protected - Admin Only)
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    const key = req.body.key; // e.g., 'home_image', 'doctor_image', 'why_us_image'
    if (!['home_image', 'doctor_image', 'why_us_image'].includes(key)) {
      return res.status(400).json({ error: 'Invalid setting key' });
    }

    const imagePath = 'uploads/' + req.file.filename;

    await Setting.findOneAndUpdate({ key }, { value: imagePath }, { upsert: true });
    res.json({ message: 'Image updated successfully', imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Gallery Images (Public)
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ created_at: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Upload Gallery Image (Protected - Admin Only, Max 20)
app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Check if limit is reached
    const count = await Gallery.countDocuments();
    if (count >= 20) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Maximum limit of 20 images reached.' });
    }

    const imagePath = 'uploads/' + req.file.filename;
    const newImage = await Gallery.create({ image_path: imagePath });
    
    res.json({ id: newImage._id, imagePath, message: 'Image added to gallery' });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

// 9. Delete Gallery Image (Protected - Admin Only)
app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findById(id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await Gallery.findByIdAndDelete(id);
      
    const filePath = path.join(__dirname, image.image_path);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 10. Increment Visitor Count (Public)
app.post('/api/visitor-count', async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'visitor_count' });
    let count = setting ? parseInt(setting.value || '0', 10) + 1 : 1;
    
    await Setting.findOneAndUpdate(
      { key: 'visitor_count' }, 
      { value: count.toString() }, 
      { upsert: true }
    );
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback for SPA routing - Serve index.html or admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
