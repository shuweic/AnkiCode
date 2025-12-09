import { Router } from 'express';
import { 
  getSettings, 
  updateNotifications,
  updateNotificationEmail,
  updateLeetCodeUsername,
  getLeetCodeStats
} from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/notifications', updateNotifications);
router.put('/notification-email', updateNotificationEmail);
router.put('/leetcode-username', updateLeetCodeUsername);
router.get('/leetcode-stats', getLeetCodeStats);

export default router;

