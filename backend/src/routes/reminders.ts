import { Router } from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
} from '../controllers/reminderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);

export default router;

