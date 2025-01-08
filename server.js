require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');

// Database connection method
connectDB();

// Express JOSN convert
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for a specific origin (more secure)
app.use(cors());

// Routes
app.use('/api/', authRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));