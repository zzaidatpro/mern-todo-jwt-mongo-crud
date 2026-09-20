import fs from 'fs';
import path from 'path';

// Chargement du fichier JSON contenant les permissions
const rolesConfig = JSON.parse(
  fs.readFileSync(path.resolve('./config/roles.json'), 'utf-8')
);

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // req.user est déjà défini par votre authMiddleware
    const userRole = req.user?.role || 'user';
    const roleDetails = rolesConfig.roles[userRole];

    if (!roleDetails) {
      return res.status(403).json({ message: 'Accès refusé : Rôle inconnu.' });
    }

    if (!roleDetails.permissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        message: `Accès refusé : Droits insuffisants (${requiredPermission} requis).` 
      });
    }

    next();
  };
};