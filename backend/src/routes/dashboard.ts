import { Router } from 'express';
import {
  getTodayReview,
  markDone,
  sendTodayReviewEmail,
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/today', getTodayReview);
router.post('/mark-done', markDone);
router.post('/todayemail', sendTodayReviewEmail);

export default router;

