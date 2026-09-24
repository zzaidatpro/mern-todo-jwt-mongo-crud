import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authService
      .getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);

  const handlePowerAction = async () => {
    if (user) {
      setIsProcessing(true);
      setIsOpen(false);

      try {
        await authService.logout();
      } catch (err) {
        console.error("Erreur lors de la déconnexion", err);
      } finally {
        setIsProcessing(false);
        setUser(null);
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  // Destination dynamique du logo selon le rôle
  const homeDestination = user?.role === "admin" ? "/user" : "/todos";

  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors relative">
      <div className="flex justify-between items-center">
        
        {/* Logo / Titre Principal */}
        <div className="text-xl font-bold tracking-wide flex items-center gap-2">
          <Link
            to={homeDestination}
            className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity"
          >
            MERN Todo
          </Link>
          {user?.role === "admin" && (
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-4 font-medium">
            {/* Masqué si l'utilisateur est un admin */}
            {user?.role !== "admin" && (
              <Link
                to="/todos"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Mes Tâches
              </Link>
            )}

            <Link
              to="/about"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              À propos
            </Link>

            {/* Lien réservé aux Administrateurs */}
            {user?.role === "admin" && (
              <Link
                to="/user"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                Gestion Utilisateurs
              </Link>
            )}

            {user && (
              <Link
                to="/auth/me"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Profil
              </Link>
            )}
          </div>

          {/* Badge utilisateur connecté */}
          {user?.email && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <span className="font-medium text-xs text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
          )}

          <ThemeToggle />

          {/* Bouton Connexion / Déconnexion */}
          <button
            type="button"
            onClick={handlePowerAction}
            disabled={isProcessing}
            className={`p-2 rounded-lg text-white transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] ${
              isProcessing
                ? "bg-slate-400 cursor-not-allowed"
                : user
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
            title={user ? "Déconnexion" : "Connexion"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>

          {/* Bouton Burger Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-3 pt-3 border-t border-slate-200 dark:border-slate-800`}>
        <div className="flex flex-col gap-3 font-medium">
          {user?.role !== "admin" && (
            <Link to="/todos" onClick={closeMenu} className="hover:text-indigo-600">
              Mes Tâches
            </Link>
          )}

          <Link to="/about" onClick={closeMenu} className="hover:text-indigo-600">
            À propos
          </Link>

          {user?.role === "admin" && (
            <Link to="/user" onClick={closeMenu} className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Gestion Utilisateurs
            </Link>
          )}

          {user && (
            <Link to="/auth/me" onClick={closeMenu} className="hover:text-indigo-600">
              Profil
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}