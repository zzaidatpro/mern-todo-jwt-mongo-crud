import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import About from "./pages/About.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Todos from "./pages/Todos.jsx";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1 w-full bg-slate-50 px-4 pb-16 pt-10 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <Routes>
                {/* Routes Publiques */}
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                {/* Routes Privées - Réservées aux Utilisateurs Clients */}
                <Route
                  path="/todos"
                  element={
                    <PrivateRoute allowedRoles={["user"]}>
                      <Todos />
                    </PrivateRoute>
                  }
                />

                {/* Route Privée - Accessible aux Clients et Admins */}
                <Route
                  path="/auth/me"
                  element={
                    <PrivateRoute allowedRoles={["user", "admin"]}>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* Route Administrateur - Réservée EXCLUSIVEMENT aux Admins */}
                <Route
                  path="/user"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminUsers />
                    </PrivateRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/todos" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}