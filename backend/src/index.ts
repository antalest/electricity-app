import { connectDB, disconnectDB } from './lib/prisma.js';
import express from 'express';
import dailystatisticRoutes from './routes/dailystatisticRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import config from './config/config.js';
import cors from 'cors';

connectDB();

const app = express();

app.use(cors())

app.use(express.json());

// Routes
app.use('/api/dailystatistics', dailystatisticRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Handle unhandled promise rejections (e.g. database connection errors)
process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.error("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});