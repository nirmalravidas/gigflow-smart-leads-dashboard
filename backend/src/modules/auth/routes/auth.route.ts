import { Router } from "express";
import { authController } from "../controller/auth.controller";

const router = Router();

router.post('/signup', authController.signup.bind(authController));

router.post('/verify-email', authController.verifyEmail.bind(authController));
router.post('/resend-verification', authController.resendVerificationEmail.bind(authController));

export default router;