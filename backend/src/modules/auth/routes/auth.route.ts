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

const router = Router();

router.post('/signup', signupValidator, validate, authController.signup.bind(authController));
router.post('/signin', signinValidator, validate, authController.signin.bind(authController));

router.post('/verify-email', verifyEmailValidator, validate, authController.verifyEmail.bind(authController));
router.post('/resend-verification', resendVerificationValidator, validate, authController.resendVerificationEmail.bind(authController));

router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword.bind(authController));
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword.bind(authController));

router.post('/refresh-token', refreshTokenValidator, validate, authController.refreshTokens.bind(authController));

router.post('/signout', authController.signout.bind(authController));

router.get('/me', authController.getProfile.bind(authController));

export default router;
