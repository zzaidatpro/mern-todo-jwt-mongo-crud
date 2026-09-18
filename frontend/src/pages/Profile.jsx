import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState({ email: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    // Récupérer les infos du profil connecté via /api/auth/me
    axios.get('http://localhost:5000/api/auth/me', authHeader)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Mon Profil</h2>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg">{message}</div>}

      <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-2">
        <label className="text-sm font-medium text-slate-600">Adresse Email</label>
        <p className="font-semibold text-slate-800">{user.email}</p>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Compte sécurisé par authentification JWT.
        </p>
      </div>
    </div>
  );
}