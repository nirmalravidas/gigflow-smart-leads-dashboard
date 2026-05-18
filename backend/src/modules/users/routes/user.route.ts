import { UserRole } from '../../../types';
import { authenticate, authorize } from '../../../middlewares/auth';
import { Router } from 'express';
import { param, body } from 'express-validator';
import { usersController } from '../controller/user.controller';
import { validate } from '../../../middlewares/validate';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/', usersController.listUsers.bind(usersController));

router.get(
    '/:id',
    [param('id').isMongoId().withMessage('Invalid user ID')],
    validate,
    usersController.getUserById.bind(usersController),
);

router.patch(
    '/:id/role',
    [
        param('id').isMongoId().withMessage('Invalid user ID'),
        body('role').isIn(Object.values(UserRole)).withMessage('Invalid role'),
    ],
    validate,
    usersController.updateUserRole.bind(usersController),
);

router.delete(
    '/:id',
    [param('id').isMongoId().withMessage('Invalid user ID')],
    validate,
    usersController.deleteUser.bind(usersController),
);

export default router;
