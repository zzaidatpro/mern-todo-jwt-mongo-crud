import express from 'express';
import cors from 'cors';

// Importation des routes
import authRoutes from './routes/authRoute.js';
import todoRoutes from './routes/todosRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

export default app;