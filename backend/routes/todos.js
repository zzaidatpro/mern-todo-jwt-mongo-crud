import express from 'express';
import Todo from '../models/Todo.js';
import auth from '../middleware/auth.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Obtenir toutes les tâches de l'utilisateur connecté
router.get('/', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
});

// Ajouter une tâche
// POST /api/todos
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, category } = req.body;

    const newTodo = new Todo({
      text,
      category: category || 'Divers', // Récupère la catégorie envoyée ou applique 'Divers'
      userId: req.user.id
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier / Basculer le statut
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { text, completed, category } = req.body;
    
    // Construire l'objet avec les champs fournis
    const updates = {};
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    if (category !== undefined) updates.category = category;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer une tâche
router.delete('/:id', auth, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Tâche supprimée.' });
});

export default router;