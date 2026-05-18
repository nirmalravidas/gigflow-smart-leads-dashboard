import { authenticate, authorize } from '../../../middlewares/auth';
import { Router } from 'express';
import { leadController } from '../controller/lead.controller';
import { UserRole } from '../../../types';

const router = Router();

router.use(authenticate);

router.get('/stats', leadController.getStats.bind(leadController));
router.get('/export', leadController.exportCSV.bind(leadController));
router.get('/', leadController.getLeads.bind(leadController));
router.post('/', leadController.createLead.bind(leadController));

router.get('/:id', leadController.getLeadById.bind(leadController));
router.put('/:id', leadController.updateLead.bind(leadController));
router.delete('/:id', authorize(UserRole.ADMIN), leadController.deleteLead.bind(leadController));

export default router;
