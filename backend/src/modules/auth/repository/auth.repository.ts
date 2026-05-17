import { hashToken } from '@/shared/utils/jwt/token';
import { authDao } from '../dao/auth.dao';
import { IUserDocument, ICreateUserDto } from '../interfaces/auth.interface';

// Auth Repository
class AuthRepository {

  findByEmail(email: string): Promise<IUserDocument | null> {
    return authDao.findUserByEmail(email);
  }

  findById(id: string): Promise<IUserDocument | null> {
    return authDao.findUserById(id);
  }

  findByVerificationToken(rawToken: string): Promise<IUserDocument | null> {
    return authDao.findUserByTokenField(
      'emailVerificationToken',
      hashToken(rawToken),
      'emailVerificationExpires',
    );
  }

  findByResetToken(rawToken: string): Promise<IUserDocument | null> {
    return authDao.findUserByTokenField(
      'passwordResetToken',
      hashToken(rawToken),
      'passwordResetExpires',
    );
  }

  findByHashedRefreshToken(hashedToken: string): Promise<IUserDocument | null> {
    return authDao.findUserByRefreshToken(hashedToken);
  }

  emailExists(email: string): Promise<boolean> {
    return authDao.existsByEmail(email);
  }

  create(dto: ICreateUserDto): Promise<IUserDocument> {
    return authDao.createUser(dto);
  }

  async setRefreshToken(userId: string, rawToken: string | undefined): Promise<void> {
    if (rawToken === undefined) {
      await authDao.unsetFields(userId, ['refreshToken']);
    } else {
      await authDao.updateUser(userId, { refreshToken: hashToken(rawToken) });
    }
  }

  async markEmailVerified(userId: string): Promise<void> {
    await authDao.updateUser(userId, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });
  }

  async setVerificationToken(
    userId: string,
    rawToken: string,
    expires: Date,
  ): Promise<void> {
    await authDao.updateUser(userId, {
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: expires,
    });
  }

  async setResetToken(
    userId: string,
    rawToken: string,
    expires: Date,
  ): Promise<void> {
    await authDao.updateUser(userId, {
      passwordResetToken: hashToken(rawToken),
      passwordResetExpires: expires,
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await authDao.findUserById(userId);
    if (!user) return;
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();
  }

  clearResetToken(userId: string): Promise<void> {
    return authDao.unsetFields(userId, ['passwordResetToken', 'passwordResetExpires']);
  }

  clearRefreshToken(userId: string): Promise<void> {
    return authDao.unsetFields(userId, ['refreshToken']);
  }
}

export const authRepository = new AuthRepository();
