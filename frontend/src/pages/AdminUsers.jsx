import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { todoService } from "../services/todoService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // États pour le panneau de tâches en bas de page
  const [selectedUser, setSelectedUser] = useState('');
  const [userTodos, setUserTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      setError(
        err.message || "Impossible de charger la liste des utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await userService.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      
      if (selectedUser?._id === id) {
        handleClosePanel();
      }

      setSuccess("Utilisateur supprimé avec succès.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Impossible de supprimer cet utilisateur.");
    }
  };

  // Sélectionner un utilisateur et filtrer ses tâches
 const handleSelectUser = async (user) => {
  if (selectedUser?._id === user._id) {
    handleClosePanel();
    return;
  }

  setSelectedUser(user);
  setLoadingTodos(true);

  try {
    const allTodos = await todoService.getTodos();

    // Récupération de l'ID cible (gestion du format string ou ObjectId)
    const targetUserId = String(user._id || user.id);

    const filteredTodos = allTodos.filter((todo) => {
      // 1. Récupérer le champ utilisateur peu importe son nom
      const userField = todo.user || todo.userId || todo.author;

      if (!userField) return false;

      // 2. Extraire la valeur de l'ID (que ce soit un string, un ObjectId ou un objet complet populé)
      let extractedId = "";

      if (typeof userField === "object") {
        
        extractedId = userField._id ? userField._id.toString() : userField.toString();
      } else {
        // Si c'est déjà un string
        extractedId = String(userField);
      }

      // 3. Comparaison
      return extractedId === targetUserId;
    });

    setUserTodos(filteredTodos);
  } catch (err) {
    console.error("Erreur lors de la récupération des tâches :", err);
  } finally {
    setLoadingTodos(false);
  }
};
  const handleClosePanel = () => {
    setSelectedUser(null);
    setUserTodos([]);
  };

  // Filtrage en temps réel basé sur l'email
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-300">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Gestion des Utilisateurs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gérez les comptes et consultez les détails ou tâches associées.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>

          <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Affichés : {filteredUsers.length} / {users.length}
          </span>
        </div>
      </div>

      {/* Champ de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          🔍
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un utilisateur par email..."
          className="w-full pl-9 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={fetchUsers} 
            className="underline text-xs font-semibold hover:text-red-800 cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* TABLEAU 1 : Liste des Utilisateurs */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-36"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-32 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-500">
                  {searchQuery ? (
                    <span>
                      Aucun résultat pour la recherche « <strong>{searchQuery}</strong> »
                    </span>
                  ) : (
                    "Aucun utilisateur trouvé."
                  )}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUser?._id === user._id;
                return (
                  <tr
                    key={user._id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {user._id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleSelectUser(user)}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors border cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                        }`}
                      >
                        {isSelected ? "Fermer" : "📋 Voir Tâches"}
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* TABLEAU 2 : Panneau inférieur des Tâches */}
      {selectedUser && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border-2 border-indigo-200 dark:border-indigo-900 p-6 transition-all">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Tâches de</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {selectedUser.email}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mode lecture seule (Consultation administrateur)
              </p>
            </div>
            <button
              onClick={handleClosePanel}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Fermer ✕
            </button>
          </div>

          {loadingTodos ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              Chargement des tâches...
            </div>
          ) : userTodos.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm italic">
              Cet utilisateur n'a aucune tâche enregistrée.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase">
                    <th className="p-3">Titre / Intitulé</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Date de création</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {userTodos.map((todo) => (
                    <tr
                      key={todo._id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20"
                    >
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-200">
                        <span className={todo.completed ? "line-through text-slate-400 dark:text-slate-500" : ""}>
                          {todo.title || todo.text || todo.label || "Tâche sans titre"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            todo.completed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {todo.completed ? "Terminée" : "En cours"}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-500 dark:text-slate-400">
                        {todo.createdAt
                          ? new Date(todo.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}