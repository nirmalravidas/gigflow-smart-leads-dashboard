import { usersDao } from '../dao/user.dao';
import { IUserDocument } from '../../auth/interfaces/auth.interface';
import { UserRole } from '../../../types';

class UsersRepository {

    findAll(): Promise<IUserDocument[]> {
        return usersDao.findAll();
    }

    findById(id: string): Promise<IUserDocument | null> {
        return usersDao.findById(id);
    }

    updateRole(id: string, role: UserRole): Promise<IUserDocument | null> {
        return usersDao.updateById(id, { role });
    }

    deleteById(id: string): Promise<void> {
        return usersDao.deleteById(id);
    }
}

export const usersRepository = new UsersRepository();
