import express from 'express';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todoController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Appliquer le middleware d'authentification sur l'ensemble des routes Todo
router.use(authMiddleware);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;