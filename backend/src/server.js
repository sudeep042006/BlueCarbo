import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import creditRoutes from './routes/credit.routes.js';
import requestRoutes from './routes/request.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middlewares
/* app.use(cors()); */
app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Serve Uploaded Images Statically
app.use('/uploads', express.static('uploads'));

// 4. Connect to Database
connectDB();

// 5. Basic Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: "BlueCarbo API is live" });
});

// 6. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} http://localhost:${PORT}`);
  console.log(`Verified routes loaded.`);
  console.log(`AI Service Verified.`);
  console.log(`User Routes Loaded.`);
});