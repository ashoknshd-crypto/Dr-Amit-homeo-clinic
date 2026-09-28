const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database.');
    initializeDefaults();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

const schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

// 1. User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, schemaOptions);
const User = mongoose.model('User', userSchema);

// 2. Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  condition: String,
  date: String,
  message: String,
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
}, schemaOptions);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// 3. Setting Schema
const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String }
}, schemaOptions);
const Setting = mongoose.model('Setting', settingSchema);

// 4. Gallery Schema
const gallerySchema = new mongoose.Schema({
  image_path: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, schemaOptions);
const Gallery = mongoose.model('Gallery', gallerySchema);

// Initialize default data
async function initializeDefaults() {
  try {
    // Seed admin user
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      const saltRounds = 10;
      const hash = await bcrypt.hash('admin123', saltRounds);
      await User.create({ username: 'admin', password: hash });
      console.log('Default admin user created. (username: admin, password: admin123)');
    }

    // Seed default settings
    const defaultSettings = [
      { key: 'home_image', value: 'assets/clinic-front.jpg' },
      { key: 'doctor_image', value: 'assets/doctor-amit-singh.jpg' },
      { key: 'why_us_image', value: 'assets/remedies.jpg' },
      { key: 'visitor_count', value: '0' }
    ];

    for (const setting of defaultSettings) {
      const exists = await Setting.findOne({ key: setting.key });
      if (!exists) {
        await Setting.create(setting);
      }
    }
  } catch (err) {
    console.error('Error initializing defaults:', err);
  }
}

module.exports = {
  User,
  Appointment,
  Setting,
  Gallery
};
