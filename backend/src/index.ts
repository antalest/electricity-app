import { connectDB, disconnectDB } from './lib/prisma';
import express from 'express';
import dailystatisticRoutes from './routes/dailystatisticRoutes';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';

connectDB();

const app = express();

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