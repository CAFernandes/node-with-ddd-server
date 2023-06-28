import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

/**
 * It logs the request's url, query and body
 * @param {Request} req - Request - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const loggerRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, url, body, query } = req;
  logger.trace({
    method,
    rota: url.split('?')[0],
    query,
    body,
  });
  next();
};
