import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await api.get('/auth/me');
        // Vérifie si l'utilisateur possède le rôle 'admin'
        if (res.data.role === 'admin') {
          setStatus({ loading: false, isAdmin: true });
        } else {
          setStatus({ loading: false, isAdmin: false });
        }
      } catch (err) {
        setStatus({ loading: false, isAdmin: false });
      }
    };

    verifyAdmin();
  }, []);

  if (status.loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <p>Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (!status.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}