import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
  };

  return (
    /* Carte responsive : 50% de largeur + texte réduit (text-[8px] / p-3) sur mobile, taille normale sur desktop (sm:w-full sm:text-base sm:p-6) */
    <div className="w-1/2 sm:w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
      <h2 className="text-sm sm:text-2xl font-bold mb-3 sm:mb-6 text-slate-800 dark:text-slate-100 text-center">
        Créer un compte
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1.5 sm:p-3 rounded-lg border border-red-200 dark:border-red-800 mb-2 sm:mb-4 text-[8px] sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
        <div>
          <label className="block text-left text-[8px] sm:text-sm font-normal text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
            Email :
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 sm:px-4 sm:py-2 text-[8px] sm:text-base border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-left text-[8px] sm:text-sm font-normal text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
            Mot de passe :
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-1 sm:px-4 sm:py-2 text-[8px] sm:text-base border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 sm:py-2 text-[8px] sm:text-base rounded-lg transition-colors cursor-pointer mt-1 sm:mt-2"
        >
          S’inscrire
        </button>
      </form>

      <p className="mt-2 sm:mt-4 text-center text-[8px] sm:text-sm text-slate-600 dark:text-slate-400">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  );
}