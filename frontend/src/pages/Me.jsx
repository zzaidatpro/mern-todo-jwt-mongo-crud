import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });

export default function Me() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Récupération des données du profil connecté
        const userRes = await api.get('/auth/me');
        setProfile(userRes.data);

        // 2. Récupération des statistiques Admin (sécurisé par le middleware RBAC backend)
        const statsRes = await api.get('/auth/admin/stats');
        setStats(statsRes.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-center">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête du Panneau Admin */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Panneau d'Administration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connecté en tant que : <span className="font-semibold text-slate-700 dark:text-slate-200">{profile?.email}</span></p>
        </div>
        <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs px-3 py-1 rounded-full font-bold uppercase border border-amber-300 dark:border-amber-700">
          Rôle : {profile?.role}
        </span>
      </div>

      {/* Cartes d'informations & Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Utilisateurs Totaux</h2>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats?.totalUsers ?? '-'}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Administrateurs</h2>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{stats?.adminUsers ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}