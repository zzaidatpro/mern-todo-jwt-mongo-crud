// middleware/rbac.js
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // 1. Vérifie si l'utilisateur est présent (injecté par authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    // 2. Si l'utilisateur est ADMIN, il a TOUS les droits automatiquement
    if (req.user.role === 'admin') {
      return next();
    }

    // 3. Sinon, on vérifie ses permissions granulaires s'il en a
    if (Array.isArray(req.user.permissions) && req.user.permissions.includes(requiredPermission)) {
      return next();
    }

    // 4. Accès refusé
    return res.status(403).json({
      message: `Accès refusé : Droits insuffisants (${requiredPermission} requis).`,
    });
  };
};