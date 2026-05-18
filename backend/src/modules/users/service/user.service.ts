import { usersRepository } from '../repository/user.repository';
import { IUserDocument } from '../../auth/interfaces/auth.interface';
import { IUserPublic, UserRole } from '@/types';
import { NotFoundError } from '@/utils/errors/AppError';

class UsersService {
    async listUsers(): Promise<IUserPublic[]> {
        const users = await usersRepository.findAll();
        return users.map(this.toPublicUser);
    }

    async getUserById(id: string): Promise<IUserPublic> {
        const user = await usersRepository.findById(id);
        if (!user) throw new NotFoundError('User');
        return this.toPublicUser(user);
    }

    async updateUserRole(id: string, role: UserRole): Promise<IUserPublic> {
        const user = await usersRepository.updateRole(id, role);
        if (!user) throw new NotFoundError('User');
        return this.toPublicUser(user);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await usersRepository.findById(id);
        if (!user) throw new NotFoundError('User');
        await usersRepository.deleteById(id);
    }

    private toPublicUser(user: IUserDocument): IUserPublic {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
        };
    }
}

export const usersService = new UsersService();
