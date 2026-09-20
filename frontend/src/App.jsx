import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Todos from './pages/Todos.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';


function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Conteneur Parent Global : Fond de page réactif */}
      <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        
        {/* Zone de contenu principal */}
       <main className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-10 px-4 pb-16 transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          {/* Carte parente qui enveloppe toutes les pages */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <Routes>
              {/* 1. Redirection automatique de la racine / vers /todos */}
              <Route path="/" element={<Navigate to="/todos" replace />} />

              {/* 2. Route dédiée pour la page des tâches */}
              <Route
                path="/todos"
                element={
                  <PrivateRoute>
                    <Todos />
                  </PrivateRoute>
                }
              />

              {/* 3. Autres routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </main>
      </div>
    </BrowserRouter>
  );
}