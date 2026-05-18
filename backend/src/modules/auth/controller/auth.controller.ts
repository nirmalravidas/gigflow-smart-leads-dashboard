import { Request, Response, NextFunction } from "express";
import { authService } from "../service/auth.service";
import { sendSuccess } from "../../../utils/apiResponse";
import { HttpStatus } from "../../../types";

class AuthController {
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.signup(req.body);

            sendSuccess(
                res, 
                'Account created successfully. Please check your email to verfiy your account.',
                result,
                HttpStatus.CREATED,
            );
        } catch (error){
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { token } = req.body as {token: string};
            const result = await authService.verifyEmail(token);
            sendSuccess(res, 'Email verified successfully', result);
        } catch(error){
            next(error);
        }
    }

    async resendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body as { email: string };
            await authService.resendVerificationEmail(email);
            sendSuccess(
                res,
                'If an account exists with that email, a verification link has been sent.',
            );
        } catch (error) {
            next(error);
        }
    }

    async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.signin(req.body);
            sendSuccess(res, 'Signed in successfully', result);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();