import { Router } from "express";
import { authController } from "../controller/auth.controller";

const router = Router();

router.post('/signup', authController.signup.bind(authController));
router.post('/signin', authController.signin.bind(authController));

router.post('/verify-email', authController.verifyEmail.bind(authController));
router.post('/resend-verification', authController.resendVerificationEmail.bind(authController));

router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

router.post('/refresh-token', authController.refreshTokens.bind(authController));

router.post('/signout', authController.signout.bind(authController));

router.get('/me', authController.getProfile.bind(authController));

export default router;