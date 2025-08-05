const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://mst-farzana.github.io',
  'https://web-app-production.up.railway.app',
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked:', origin);
      callback(new Error('CORS policy does not allow this origin'), false);
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ======= Middleware order =======

// 1. Body parsers first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Then CORS
app.use(cors(corsOptions));

// 3. Security and logging
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 4. Static files with open CORS
app.use(
  '/images',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (or restrict to your frontend URL)
    next();
  },
  express.static(path.join(__dirname, 'public/images'))
);

app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Same here
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// ======= Routes =======

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const discountRoutes = require('./routes/discountRoutes');
const categoryItemRoutes = require('./routes/categoryItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mailRoutes = require('./routes/mailRoutes');
const contactRoutes = require('./routes/contactRoutes');

try {
  app.use('/api/users', userRoutes);
} catch (err) {
  console.error('❌ Error registering /api/users:', err.message);
}

// Repeat for all routes similarly...

try {
  app.use('/api/admin', adminRoutes);
} catch (err) {
  console.error('❌ Error registering /api/admin:', err.message);
}

try {
  app.use('/api/discounts', discountRoutes);
} catch (err) {
  console.error('❌ Error registering /api/discounts:', err.message);
}

try {
  app.use('/api/categoryItems', categoryItemRoutes);
} catch (err) {
  console.error('❌ Error registering /api/categoryItems:', err.message);
}

try {
  app.use('/api/orders', orderRoutes);
} catch (err) {
  console.error('❌ Error registering /api/orders:', err.message);
}

try {
  app.use('/api/mail', mailRoutes);
} catch (err) {
  console.error('❌ Error registering /api/mail:', err.message);
}

try {
  app.use('/api/contact', contactRoutes);
} catch (err) {
  console.error('❌ Error registering /api/contact:', err.message);
}

// ======= Base Routes =======
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => res.send('OK'));

// ======= 404 Handler =======
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// ======= Error Handler =======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ======= Start Server =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
