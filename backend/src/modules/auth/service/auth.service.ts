import { ITokenPair, IUserPublic, UserRole } from "../../../types";
import { authRepository } from "../repository/auth.repository";
import { ConflictError, UnauthorizedError, ValidationError } from "../../../utils/errors/AppError";
import { generateSecureToken, generateTokenPair, hashToken } from "../../../utils/jwt/token";
import { ISigninDto, ISignupDto } from "../dto/auth.dto";
import { sendVerificationCodeEmail, sendWelcomeEmail } from "../../../utils/mail/email";
import { IUserDocument } from "../interfaces/auth.interface";

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;

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

        sendVerificationCodeEmail(user.email, verificationToken).catch((error) => {
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

        await sendVerificationCodeEmail(user.email, verificationToken);
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