import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthPayload } from '@user/infra/types/AuthPayload';
import { AuthenticateRequest } from '@user/infra/types/AuthenticateRequest';
import { logger } from '@/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default';

export const authenticateToken = async (
  request: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      let decoded = await new Promise((resolve, reject) => {
        verify(token, JWT_SECRET, (err: any, decoded: any) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
      const payload = decoded as AuthPayload;
      request.user = payload; // Armazena o payload do token na requisição
      next();
    } catch (error: Error | any) {
      logger.error('authenticateToken() - Error', error);
      return res.status(401).json(error?.message || ''); // Token inválido
    }
  } else {
    return res.sendStatus(401); // Token não fornecido
  }
};
