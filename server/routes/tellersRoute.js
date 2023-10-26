import { Router } from 'express';
import { createNewTeller } from '../controllers/tellersController.js';

const router = Router();

router.post('/create', createNewTeller);

export default router;