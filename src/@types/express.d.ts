import { AuthPayload } from '@user/infra/types/AuthPayload';

declare namespace Express {
  export interface Request {
    user: AuthPayload;
  }
}
