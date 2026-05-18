import { Request, Response, NextFunction } from 'express';
import { usersService } from '../service/user.service';
import { IUpdateUserRoleDto } from '../dto/user.dto';
import { sendSuccess } from '../../../utils/apiResponse';

class UsersController {
    async listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await usersService.listUsers();
            sendSuccess(res, 'Users fetched successfully', { users, total: users.length });
        } catch (error) {
            next(error);
        }
  }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Array.isArray(req.params['id']) ? req.params['id'][0]! : (req.params['id'] ?? '');
            const user = await usersService.getUserById(id);
            sendSuccess(res, 'User fetched successfully', user);
        } catch (error) {
            next(error);
        }
    }

    async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Array.isArray(req.params['id']) ? req.params['id'][0]! : (req.params['id'] ?? '');
            const { role } = req.body as IUpdateUserRoleDto;
            const user = await usersService.updateUserRole(id, role);
            sendSuccess(res, 'User role updated successfully', user);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Array.isArray(req.params['id']) ? req.params['id'][0]! : (req.params['id'] ?? '');
            await usersService.deleteUser(id);
            sendSuccess(res, 'User deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

export const usersController = new UsersController();
