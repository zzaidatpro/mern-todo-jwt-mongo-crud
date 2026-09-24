import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

// Helper pour extraire l'userId de façon cohérente
const getUserId = (req) => req.user?.id ?? req.user?._id;

// Obtenir toutes les tâches de l'utilisateur connecté
export const getTodos = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (err) {
    console.error('getTodos error:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Ajouter une tâche
export const createTodo = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const { text, category } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Le texte de la tâche est requis.' });
    }

    const newTodo = new Todo({
      text: text.trim(),
      category: category?.trim() || 'Divers',
      userId,
    });

    const savedTodo = await newTodo.save();
    return res.status(201).json(savedTodo);
  } catch (err) {
    console.error('createTodo error:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier / Basculer le statut d'une tâche
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation du format d'ObjectId Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide.' });
    }

    const userId = getUserId(req);
    const { text, completed, category } = req.body;

    if (text !== undefined && !text?.trim()) {
      return res.status(400).json({ message: 'Le texte ne peut pas être vide.' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ message: '"completed" doit être un booléen.' });
    }

    const updates = {};
    if (text !== undefined) updates.text = text.trim();
    if (completed !== undefined) updates.completed = completed;
    if (category !== undefined) updates.category = category?.trim() || 'Divers';

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée.' });
    }

    return res.json(updatedTodo);
  } catch (err) {
    console.error('updateTodo error:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une tâche
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation du format d'ObjectId Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Identifiant de tâche invalide.' });
    }

    const userId = getUserId(req);

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée.' });
    }

    return res.json({ message: 'Tâche supprimée.' });
  } catch (err) {
    console.error('deleteTodo error:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};