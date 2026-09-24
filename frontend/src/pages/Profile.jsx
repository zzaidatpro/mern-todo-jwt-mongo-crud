import { useState, useEffect } from "react";
import { authService } from "../services/authService";

export default function Profile() {
  const [user, setUser] = useState({ email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setUser(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Erreur lors du chargement du profil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-center text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Mon Profil
      </h2>

      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Adresse Email
          </label>
          <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
            {user.email}
          </p>
        </div>

        {user.role && (
          <div>
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Rôle
            </label>
            <div className="mt-1">
              <span className="inline-block bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compte sécurisé par cookies{" "}
          <span className="font-mono text-indigo-600 dark:text-indigo-400">
            HttpOnly
          </span>
          .
        </p>
      </div>
    </div>
  );
}