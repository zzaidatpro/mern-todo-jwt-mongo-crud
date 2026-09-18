import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

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
   <div className="w-1/2space-y-8 text-slate-700 dark:text-slate-300">
    <h2 className="text-2xl font-bold !text-indigo-600 dark:!text-indigo-400 hover:opacity-80 transition-opacity">
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
            placeholder="exemple@email.com"
            className="w-full px-2 py-1 sm:px-4 sm:py-2 text-[8px] sm:text-base border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-left text-[8px] sm:text-sm font-normal text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
            Mot de passe :
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="votre mot de passe"
              className="w-full px-2 py-1 sm:px-4 sm:py-2 pr-7 sm:pr-10 text-[8px] sm:text-base border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                /* Icône Œil Barré */
                <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.88 9.88a3 3 0 104.24 4.24m-1.06-7.06a9.97 9.97 0 014.94 1.94c3.27 2.62 5 6.12 5 6.12a18.4 18.4 0 01-3.2 4.1M3 3l18 18" />
                </svg>
              ) : (
                /* Icône Œil Ouvrant */
                <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 sm:py-2 text-[8px] sm:text-base rounded-lg transition-colors cursor-pointer mt-1 sm:mt-2"
        >
          S’inscrire
        </button>
      </form>

      <div className="mt-3 sm:mt-6 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
        <p className="text-center text-[8px] sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>  
    </div>
  );
}