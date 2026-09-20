import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';

describe('--- Tests Unitaires : authMiddleware ---', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'secret_de_test';
  });

  it('devrait retourner 401 si aucun en-tête Authorization n\'est fourni', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès non autorisé, jeton manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si le format du header n\'est pas Bearer <token>', () => {
    req.headers.authorization = 'Basic token_invalide';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès non autorisé, jeton manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si le token JWT est expiré ou invalide', () => {
    req.headers.authorization = 'Bearer mauvais_token';

    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('jwt expired');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Jeton invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();

    jwt.verify.mockRestore();
  });

  it('devrait attacher l\'utilisateur à req.user et appeler next() si le token est valide', () => {
    const mockUserPayload = { id: 'user_id_123', email: 'test@example.com' };
    req.headers.authorization = 'Bearer token_valide';

    jest.spyOn(jwt, 'verify').mockReturnValue(mockUserPayload);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('token_valide', process.env.JWT_SECRET);
    expect(req.user).toEqual(mockUserPayload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();

    jwt.verify.mockRestore();
  });
});