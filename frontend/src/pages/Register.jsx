import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Veuillez renseigner votre adresse e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        email: normalizedEmail,
        password,
      });

      navigate("/auth/login", { replace: true });
    } catch (err) {
      const responseMessage = err.response?.data?.message;
      setError(
        responseMessage || "Une erreur est survenue lors de l’inscription."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 text-slate-700 dark:text-slate-300">
      <h2 className="text-center text-2xl font-bold text-indigo-600 transition-opacity hover:opacity-80 dark:text-indigo-400">
        Créer un compte
      </h2>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email :
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="exemple@email.com"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-left text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Mot de passe :
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={
                showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 focus:outline-none dark:text-slate-400 dark:hover:text-indigo-400"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.88 9.88a3 3 0 104.24 4.24m-1.06-7.06a9.97 9.97 0 014.94 1.94c3.27 2.62 5 6.12 5 6.12a18.4 18.4 0 01-3.2 4.1M3 3l18 18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
              Inscription en cours...
            </>
          ) : (
            "S’inscrire"
          )}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Déjà un compte ?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}