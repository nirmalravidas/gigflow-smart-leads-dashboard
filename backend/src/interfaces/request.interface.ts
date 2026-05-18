import type { Request } from 'express';
import { IJwtPayload } from './auth.interface';

export interface IAuthenticatedRequest extends Request {
  user: IJwtPayload;
}
