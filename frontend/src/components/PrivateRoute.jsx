import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    authService
      .getMe()
      .then(() => {
        if (isMounted) setIsAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-xs text-slate-500">Vérification de la session...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
}