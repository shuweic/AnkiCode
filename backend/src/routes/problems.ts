import { Router } from 'express';
import {
  getProblems,
  createProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProblems);
router.post('/', createProblem);
router.get('/:id', getProblemById);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;

