import { IUserPublic, UserRole } from '../../../types';
import { IUserDocument } from '../../auth/interfaces/auth.interface';

export interface IUsersService {
    listUsers(): Promise<IUserPublic[]>;
    getUserById(id: string): Promise<IUserPublic>;
    updateUserRole(id: string, role: UserRole): Promise<IUserPublic>;
    deleteUser(id: string): Promise<void>;
}

export interface IUsersRepository {
    findAll(): Promise<IUserDocument[]>;
    findById(id: string): Promise<IUserDocument | null>;
    updateRole(id: string, role: UserRole): Promise<IUserDocument | null>;
    deleteById(id: string): Promise<void>;
}

export interface IUsersDao {
    findAll(): Promise<IUserDocument[]>;
    findById(id: string): Promise<IUserDocument | null>;
    updateById(id: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null>;
    deleteById(id: string): Promise<void>;
}
