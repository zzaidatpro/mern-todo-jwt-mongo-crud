import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Connexion et récupération des données utilisateur
      const data = await authService.login({ email, password });
      console.log(data)
      
      // 2. Extraire le rôle
      const userRole = data?.user?.role || data?.role;

      // 3. Rediriger selon le rôle
      if (userRole === "admin") {
        navigate("/user"); // Redirection Admin
      } else {
        navigate("/todos");     // Redirection Utilisateur
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError(
        err.response?.data?.message || err.message || "Erreur lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
        Connexion
      </h2>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Adresse Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="exemple@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors cursor-pointer flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Pas encore de compte ?{" "}
        <Link
          to="/auth/register"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          S'inscrire
        </Link>
      </p>
    </div>
  );
}