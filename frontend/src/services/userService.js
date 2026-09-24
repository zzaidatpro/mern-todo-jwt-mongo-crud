import API from '../api/axios.js';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await API.get('/auth/user/getAllUsers');
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Impossible de récupérer les utilisateurs.';
      throw new Error(message);
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await API.delete(`/auth/user/deleteAllUsers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Détails erreur API getAllUsers :', error.response);
      const message =
        error.response?.data?.message ||
        'Impossible de supprimer cet utilisateur.';
      throw new Error(message);
    }
  },
};