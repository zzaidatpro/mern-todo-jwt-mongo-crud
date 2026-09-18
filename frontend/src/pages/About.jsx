export default function About() {
  return (
    <div className="space-y-6 text-slate-700">
      <h2 className="text-2xl font-bold text-slate-800">À propos de l'application</h2>
      
      <p className="leading-relaxed">
        Cette application de gestion de tâches est une démonstration d'architecture full-stack 
        basée sur la pile **MERN** (MongoDB, Express, React, Node.js) structurée avec des ES Modules.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-slate-800">Fonctionnalités clés :</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
          <li>Authentification sécurisée par jetons JWT</li>
          <li>API RESTful construite avec Express et Mongoose</li>
          <li>Interface réactive développée avec React et Vite</li>
          <li>Design moderne et adaptatif avec Tailwind CSS</li>
        </ul>
      </div>

      <p className="text-sm text-slate-500 italic">
        Projet configuré en mode ES Modules (`type: "module"`).
      </p>
    </div>
  );
}