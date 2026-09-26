import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../app.js';

let mongoServer;
let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'secret_de_test';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Générer un ObjectId MongoDB valide sous forme de chaîne
  const userId = new mongoose.Types.ObjectId().toString();

  // Inclure à la fois 'id' et '_id' pour garantir la compatibilité avec req.user
  token = jwt.sign(
    { id: userId, _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('--- Tests d\'intégration : API Todos ---', () => {

  it('GET /api/todos › devrait retourner une liste vide au départ', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/todos › devrait créer une nouvelle tâche avec succès', async () => {
    const newTodo = { text: 'Acheter du pain', category: 'Personnel' };

    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(newTodo);

    // Afficher le message d'erreur réel retourné par Express / Mongoose
    if (res.statusCode !== 201) {
      console.log('--- ERREUR SERVEUR 500 ---', res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.text).toBe('Acheter du pain');
    expect(res.body.category).toBe('Personnel');
  });

  it('POST /api/todos › devrait appliquer la catégorie par défaut "Divers" si absente', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Faire du sport' });

    expect(res.statusCode).toBe(201);
    expect(res.body.category).toBe('Divers');
  });

  it('PUT /api/todos/:id › devrait mettre à jour une tâche existante', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Ancien texte' });

    const todoId = createRes.body._id;

    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Nouveau texte', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Nouveau texte');
    expect(res.body.completed).toBe(true);
  });

  it('PUT /api/todos/:id › devrait retourner 404 si la tâche n\'existe pas', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/todos/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Test' });

    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/todos/:id › devrait supprimer une tâche existante', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Tâche à supprimer' });

    const todoId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tâche supprimée.');
  });
});