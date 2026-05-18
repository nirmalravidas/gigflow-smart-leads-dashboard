import { Request, Response, NextFunction } from "express";
import { authServive } from "../service/auth.service";
import { sendSuccess } from "../../../shared/utils/apiResponse";
import { HttpStatus } from "../../../shared/types";

class AuthController {
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authServive.signup(req.body);

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
            const result = await authServive.verifyEmail(token);
            sendSuccess(res, 'Email verified successfully', result);
        } catch(error){
            next(error);
        }
    }
}

export const authController = new AuthController();