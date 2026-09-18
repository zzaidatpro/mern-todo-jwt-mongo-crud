import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Correction : récupérer 'token' et non ''
  const token = localStorage.getItem('token');

  // Met à jour l'email à chaque changement de page/route
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      setUserEmail('');
    }
  }, [location]);

  const closeMenu = () => setIsOpen(false);

  const handlePowerAction = () => {
    if (token) {
      setIsProcessing(true);
      setIsOpen(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      sessionStorage.clear();

      setTimeout(() => {
        setIsProcessing(false);
        setUserEmail('');
        navigate('/login');
      }, 300);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors relative">
      <div className="flex justify-between items-center">
        {/* Logo MERN Todo */}
        <div className="text-xl font-bold tracking-wide">
          <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity">
            MERN Todo
          </Link>
        </div>

        {/* Partie Droite : Navigation Desktop + Email + ThemeToggle + Power + Burger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-4 font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Mes Tâches
            </Link>
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              À propos
            </Link>
          </div>

          {/* Email Desktop (Masqué sur mobile) */}
          {userEmail && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-xs text-slate-700 dark:text-slate-200 truncate">
                {userEmail}
              </span>
            </div>
          )}

          {/* ThemeToggle */}
          <ThemeToggle />

          {/* Bouton Power Connexion/Déconnexion */}
          <button
            type="button"
            onClick={handlePowerAction}
            disabled={isProcessing}
            className={`p-2 rounded-lg text-white transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
              isProcessing
                ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                : token
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
            title={token ? 'Déconnexion' : 'Connexion'}
            aria-label={token ? 'Déconnexion' : 'Connexion'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>

          {/* Bouton Burger Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-transform duration-200"
            aria-label="Toggle Menu"
          >
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out w-1/2 ml-auto ${
          isOpen ? 'max-h-48 opacity-100 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'
        }`}
      >
        {/* Email Mobile */}
        {userEmail && (
          <div className="flex items-center justify-end gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 mb-2">
            <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-[9px] text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
              {userEmail}
            </span>
          </div>
        )}

        {/* Liens Mobile */}
        <div className="flex flex-col gap-1 font-medium text-[10px] pb-1 text-right">
          <Link
            to="/"
            onClick={closeMenu}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-0.5"
          >
            Mes Tâches
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-0.5"
          >
            À propos
          </Link>
        </div>
      </div>
    </nav>
  );
}