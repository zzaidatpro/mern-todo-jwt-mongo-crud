import api from '../api/axios';

export const todoService = {
  getTodos: async () => {
    const response = await api.get('/todos');
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  updateTodo: async (id, updates) => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};