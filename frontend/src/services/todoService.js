import API from '../api/axios';

export const todoService = {
  getTodos: async () => {
    const response = await API.get('/todos');
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await API.post('/todos', todoData);
    return response.data;
  },

  updateTodo: async (id, updates) => {
    const response = await API.put(`/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await API.delete(`/todos/${id}`);
    return response.data;
  },
};