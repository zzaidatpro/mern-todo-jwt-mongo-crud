import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/todos';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personnel');
  const [error, setError] = useState('');

  // États pour l'édition d'une tâche
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('Personnel');

  // États de filtrage et recherche
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState('Toutes');

  const navigate = useNavigate();

  // Helper pour récupérer le header d'auth dynamiquement
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTodos = async () => {
      try {
        const res = await axios.get(API_URL, getAuthHeader());
        setTodos(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Impossible de charger les tâches.');
        }
      }
    };

    fetchTodos();
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        API_URL,
        { text, category },
        getAuthHeader()
      );
      setTodos((prev) => [...prev, res.data]);
      setText('');
      setCategory('Personnel');
      setError('');
    } catch (err) {
      setError('Erreur lors de l’ajout de la tâche.');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        { completed: !completed },
        getAuthHeader()
      );
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError('Erreur de mise à jour.');
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text || todo.title || '');
    setEditCategory(todo.category || 'Personnel');
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        { text: editText, category: editCategory },
        getAuthHeader()
      );
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      setError('Erreur lors de la modification de la tâche.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  // Mémorisation du filtrage
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const todoText = todo.text || todo.title || '';
      const matchesSearch = todoText.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === 'Toutes' || todo.category === filterCategory;
      const matchesStatus =
        filterStatus === 'Toutes'
          ? true
          : filterStatus === 'Terminées'
          ? todo.completed
          : !todo.completed;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [todos, search, filterCategory, filterStatus]);

  return (
    <div className="space-y-8 text-slate-700 dark:text-slate-300">
      <h2 className="text-2xl font-bold !text-indigo-600 dark:!text-indigo-400 hover:opacity-80 transition-opacity">
        Gestion des Tâches
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAdd} className="flex gap-2 flex-col sm:flex-row">
        <input
          id='nouvelletache0'
          name='nouvelleTache0'
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value="Personnel">Personnel</option>
          <option value="Travail">Travail</option>
          <option value="Urgent">Urgent</option>
          <option value="Divers">Divers</option>
        </select>
        <button
          id='BoutonAdd'
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Ajouter
        </button>
      </form>

      {/* Filtres & Recherche */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 transition-colors">
        <input
          id='rechercherUneTache'
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher une tâche..."
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg transition-colors"
          >
            <option value="Toutes">Toutes les catégories</option>
            <option value="Personnel">Personnel</option>
            <option value="Travail">Travail</option>
            <option value="Urgent">Urgent</option>
            <option value="Divers">Divers</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg transition-colors"
          >
            <option value="Toutes">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option id='termineTache' value="Terminées">Terminées</option>
          </select>
        </div>
      </div>

      {/* Liste des tâches */}
      <ul className="space-y-2">
        {filteredTodos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors gap-2"
          >
            {editingId === todo._id ? (
              /* Mode Édition */
              <div className="flex gap-2 flex-1 items-center flex-wrap sm:flex-nowrap">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(todo._id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 px-3 py-1 border border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none text-sm transition-colors"
                  autoFocus
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md"
                >
                  <option value="Personnel">Personnel</option>
                  <option value="Travail">Travail</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Divers">Divers</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSaveEdit(todo._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    title="Valider"
                    aria-label="Valider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">Valider</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-slate-400 hover:bg-slate-500 text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    title="Annuler"
                    aria-label="Annuler"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline">Annuler</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Mode Affichage */
              <>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-1 rounded-full transition-colors shrink-0">
                    {todo.category || 'Divers'}
                  </span>
                  <span
                    onClick={() => handleToggle(todo._id, todo.completed)}
                    className={`cursor-pointer transition-all truncate ${
                      todo.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {todo.text || todo.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => startEditing(todo)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    title="Éditer"
                    aria-label="Éditer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Éditer</span>
                  </button>

                  <button
                    id='boutonSup'
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    title="Supprimer"
                    aria-label="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}