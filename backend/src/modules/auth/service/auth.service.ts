import { IUserPublic, UserRole } from "../../../shared/types";
import { authRepository } from "../repository/auth.repository";
import { ConflictError, ValidationError } from "../../../shared/utils/errors/AppError";
import { generateSecureToken, hashToken } from "../../../shared/utils/jwt/token";
import { ISignupDto } from "../dto/auth.dto";
import { sendVerificationCodeEmail, sendWelcomeEmail } from "../../../shared/utils/mail/email";
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

export const authServive = new AuthService();