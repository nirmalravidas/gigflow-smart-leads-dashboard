import { ITokenPair, IUserPublic, UserRole } from "../../../types";
import { authRepository } from "../repository/auth.repository";
import { AppError, ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "../../../utils/errors/AppError";
import { generateSecureToken, generateTokenPair, hashToken, verifyRefreshToken } from "../../../utils/jwt/token";
import { ISigninDto, ISignupDto } from "../dto/auth.dto";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationCodeEmail, sendWelcomeEmail } from "../../../utils/mail/email";
import { IUserDocument } from "../interfaces/auth.interface";
import { config } from "../../../config/env";

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESET_EXPIRY_MS = 60 * 60 * 1000;

class AuthService {

    async signup(dto: ISignupDto): Promise<{ user: IUserPublic }> {
        const existingUser = await authRepository.emailExists(dto.email);

        if(existingUser){
            throw new ConflictError('An account with this email already exists');
        }

        const verificationToken = generateSecureToken();

        const user = await authRepository.create({
            name: dto.name,
            email: dto.email.toLowerCase(),
            password: dto.password,
            role: dto.role ?? UserRole.SALES,
            emailVerificationToken: hashToken(verificationToken),
            emailVerificationExpires: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
        });

        // Generate verification URL (similar to forgot password)
        const baseUrl = config.client.url?.replace(/\/+$/, '') || '';
        const verificationUrl = baseUrl
            ? `${baseUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`
            : verificationToken;

        sendVerificationCodeEmail(user.email, verificationUrl).catch((error) => {
            console.error('[AuthService] Failed to send verification email:', error);
        });

        return {
            user: this.toPublicUser(user)
        };
    }

    async verifyEmail(rawToken: string): Promise<{user: IUserPublic}>{
        const user = await authRepository.findByVerificationToken(rawToken);
        if(!user){
            throw new ValidationError('Invalid or expired verification token');
        }

        await authRepository.markEmailVerified(user._id.toString());
        
        sendWelcomeEmail(user.email, user.name).catch((error) => {
            console.error('[AuthService] failed to send welcome emial:', error);
        });

        return {
            user: this.toPublicUser(user),
        }
    }

    async resendVerificationEmail(email: string): Promise<void> {
        const user = await authRepository.findByEmail(email.toLowerCase());

        if (!user) return;

        if (user.isEmailVerified) {
            throw new ValidationError('Email is already verified');
        }

        const verificationToken = generateSecureToken();

        await authRepository.setVerificationToken(
            user._id.toString(),
            verificationToken,
            new Date(Date.now() + VERIFICATION_EXPIRY_MS),
        );

        // Generate verification URL
        const baseUrl = config.client.url?.replace(/\/+$/, '') || '';
        const verificationUrl = baseUrl
            ? `${baseUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`
            : verificationToken;

        await sendVerificationCodeEmail(user.email, verificationUrl);
    }

    async signin(dto: ISigninDto): Promise<{ user: IUserPublic; tokens: ITokenPair; }> {
        const user = await authRepository.findByEmail(dto.email.toLowerCase());

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(dto.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedError(
                'Please verify your email before signing in',
            );
        }

        const tokens = generateTokenPair(
            user._id.toString(),
            user.email,
            user.role,
        );

        await authRepository.setRefreshToken(
            user._id.toString(),
            tokens.refreshToken,
        );

        return {
            user: this.toPublicUser(user),
            tokens,
        };
    }

    async refreshTokens(rawRefreshToken: string): Promise<ITokenPair> {
        let payload;

        try {
            payload = verifyRefreshToken(rawRefreshToken);
        } catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const hashedToken = hashToken(rawRefreshToken);

        const user = await authRepository.findByHashedRefreshToken(hashedToken);

        if (!user || user._id.toString() !== payload.userId) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        const tokens = generateTokenPair(
            user._id.toString(),
            user.email,
            user.role,
        );

        await authRepository.setRefreshToken(
            user._id.toString(),
            tokens.refreshToken,
        );

        return tokens;
    }

    async signout(userId: string): Promise<void> {
        await authRepository.clearRefreshToken(userId);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await authRepository.findByEmail(email.toLowerCase());

        if (!user) return;

        const resetToken = generateSecureToken();

        await authRepository.setResetToken(
            user._id.toString(),
            resetToken,
            new Date(Date.now() + RESET_EXPIRY_MS),
        );

        const baseUrl = config.client.url?.replace(/\/+$/, '') || '';
            const resetUrl = baseUrl
                ? `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`
                : resetToken;

        try {
            await sendPasswordResetEmail(user.email, resetUrl);
        } catch (error) {
            await authRepository.clearResetToken(user._id.toString());

            console.error('[AuthService] Forgot password email failed:', error);

            throw new AppError(
                'Failed to send password reset email. Please try again.',
                500,
            );
        }
    }

    async resetPassword( rawToken: string, newPassword: string, ): Promise<void> {

        const user = await authRepository.findByResetToken(rawToken);

        if (!user) {
            throw new ValidationError(
                'Invalid or expired password reset token',
            );
        }

        await authRepository.updatePassword(
            user._id.toString(),
            newPassword,
        );

        sendPasswordResetSuccessEmail(user.email).catch((error) => {
            console.error(
                '[AuthService] Password reset success email failed:',
                error,
            );
        });
    }

    async getProfile(userId: string): Promise<IUserPublic> {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User');
        }

        return this.toPublicUser(user);
    }


    private toPublicUser(user: IUserDocument): IUserPublic {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
        }
    }


}

export const authService = new AuthService();