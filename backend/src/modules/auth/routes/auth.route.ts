import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { validate } from "../../../middlewares/validate";
import {
    signupValidator,
    signinValidator,
    verifyEmailValidator,
    resendVerificationValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    refreshTokenValidator,
} from "../validators/auth.validator";
import { authenticate } from "../../../middlewares/auth";
import { authRateLimiter, passwordResetLimiter } from "@/middlewares/rateLimiter";

const router = Router();

router.post('/signup', authRateLimiter, signupValidator, validate, authController.signup.bind(authController));
router.post('/signin', authRateLimiter, signinValidator, validate, authController.signin.bind(authController));

router.post('/verify-email', verifyEmailValidator, validate, authController.verifyEmail.bind(authController));
router.post('/resend-verification', authRateLimiter, resendVerificationValidator, validate, authController.resendVerificationEmail.bind(authController));

router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidator, validate, authController.forgotPassword.bind(authController));
router.post('/reset-password', passwordResetLimiter, resetPasswordValidator, validate, authController.resetPassword.bind(authController));

router.post('/refresh-token', refreshTokenValidator, validate, authController.refreshTokens.bind(authController));

router.post('/signout', authenticate, authController.signout.bind(authController));

router.get('/me', authenticate, authController.getProfile.bind(authController));

export default router;
