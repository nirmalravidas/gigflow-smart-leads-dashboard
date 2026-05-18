import { IAuthenticatedRequest, UserRole } from '../types';
import { ForbiddenError, UnauthorizedError } from '../utils/errors/AppError';
import { verifyAccessToken } from '../utils/jwt/token';
import {Request, Response, NextFunction} from 'express';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return next(new UnauthorizedError('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try{
        const payload = verifyAccessToken(token);
        (req as IAuthenticatedRequest).user = payload;
        next();
    } catch {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const authreq = req as IAuthenticatedRequest;

        if(!authreq.user){
            return next(new UnauthorizedError());
        }

        if(!roles.includes(authreq.user.role)){
            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    }
}
