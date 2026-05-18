import { UserModel } from '../../auth/model/user.model';
import { IUserDocument } from '../../auth/interfaces/auth.interface';
import { UserRole } from '../../../types';

class UsersDao {
    async findAll(): Promise<IUserDocument[]> {
        return UserModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IUserDocument | null> {
        return UserModel.findById(id);
    }

    async updateById( id: string, updates: Partial<Record<string, unknown>>, ): Promise<IUserDocument | null> {
        return UserModel.findByIdAndUpdate(id, updates, { 
            new: true, 
            runValidators: true 
        });
    }

    async deleteById(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }

    async countByRole(role: UserRole): Promise<number> {
        return UserModel.countDocuments({ role } as Record<string, unknown>);
    }
}

export const usersDao = new UsersDao();
