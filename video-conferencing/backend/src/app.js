import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://meetingnow.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;

