import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// Root auth aliases for direct compatibility (/register, /login, etc.)
app.use('/', authRoutes);

// Static frontend serving if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/tasks')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 & Global Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
