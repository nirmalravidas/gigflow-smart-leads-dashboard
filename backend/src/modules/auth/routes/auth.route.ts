import { Router } from "express";
import { authController } from "../controller/auth.controller";

const router = Router();

router.post('/signup', authController.signup.bind(authController));

router.post('/verify-email', authController.verifyEmail.bind(authController));

export default router;