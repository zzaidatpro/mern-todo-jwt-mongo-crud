import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Importation des routes en ES Modules (extensions .js obligatoires)
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Utilisation des routes importées
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));