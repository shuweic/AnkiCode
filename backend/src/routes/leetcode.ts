import { Router } from 'express';
import { searchByQuestionId, getProblemDetails } from '../controllers/leetcodeController';

const router = Router();

// 公开端点，不需要认证
router.get('/search', searchByQuestionId);
router.get('/details', getProblemDetails);

export default router;

