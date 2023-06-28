import { Request } from 'express';
import { AuthPayload } from './AuthPayload';

export interface AuthenticateRequest extends Request {
  user?: AuthPayload; // Defina o tipo correto do payload do usuário
}
