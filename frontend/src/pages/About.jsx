export default function About() {
  return (
   <div className="space-y-8 text-slate-700 dark:text-slate-300">
    <h2 className="text-2xl font-bold !text-indigo-600 dark:!text-indigo-400 hover:opacity-80 transition-opacity">
     A propos de l'application</h2>
      
      <p className="hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">
        Cette application de gestion de tâches est une démonstration d'architecture full-stack 
        basée sur la pile **MERN** (MongoDB, Express, React, Node.js) structurée avec des ES Modules.
                                                                                                  
      </p>

        <div 
        className="relative my-6 border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-cover bg-center overflow-hidden shadow-md transition-all">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 pointer-events-none" />
      <div>
        
       <h3 className="text-left font-bold text-slate-900 dark:text-white drop-shadow-sm text-base sm:text-lg">
            Fonctionnalités clés :          </h3>
        <ul className="list-disc list-inside space-y-2 text-sm font-medium text-slate-900 dark:text-slate-100 drop-shadow-sm text-left"> <li>Authentification sécurisée par jetons JWT</li>
          <li>API RESTful construite avec Express et Mongoose</li>
          <li>Interface réactive développée avec React et Vite</li>
          <li>Design moderne et adaptatif avec Tailwind CSS</li>
        </ul>
      </div>
      </div>
      

      <p className="text-sm text-slate-500 italic">
        Projet configuré en mode ES Modules (`type: "module"`).
      </p>
    </div>
  );
}