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

// ======= Serve Static Files with CORS header =======
const allowedOrigins = [
  'https://mst-farzana.github.io',
  'https://web-app-production.up.railway.app',
];

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

app.use(cors(corsOptions));

// Static files serving with CORS allowing all origins (or চাইলে production ডোমেইন দিবেন)
app.use(
  '/images',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // অথবা প্রডাকশন ডোমেইন দিন
    next();
  },
  express.static(path.join(__dirname, 'public/images'))
);

app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // অথবা প্রডাকশন ডোমেইন দিন
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Optional: for form-urlencoded data
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Only log in dev mode
}

// ======= Routes =======
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const discountRoutes = require('./routes/discountRoutes');
const categoryItemRoutes = require('./routes/categoryItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mailRoutes = require('./routes/mailRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/categoryItems', categoryItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api', contactRoutes);

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
