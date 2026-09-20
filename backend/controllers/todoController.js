import Todo from '../models/Todo.js';

// Obtenir toutes les tâches de l'utilisateur connecté
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Ajouter une tâche
export const createTodo = async (req, res) => {
  try {
    const { text, category } = req.body;
    const userId = req.user.id || req.user._id;

    const newTodo = new Todo({
      text,
      category: category || 'Divers',
      userId
    });

    const savedTodo = await newTodo.save();
    return res.status(201).json(savedTodo);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier / Basculer le statut d'une tâche
export const updateTodo = async (req, res) => {
  try {
    const { text, completed, category } = req.body;
    const userId = req.user.id || req.user._id;

    // Construire l'objet avec les champs fournis
    const updates = {};
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    if (category !== undefined) updates.category = category;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { returnDocument: 'after' } // Remplace { new: true } pour éliminer l'avertissement Mongoose
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }

    res.json(updatedTodo);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Supprimer une tâche
export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }

    return res.json({ message: 'Tâche supprimée.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};