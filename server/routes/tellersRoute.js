import { Router } from 'express';
import { createNewTeller, login } from '../controllers/tellersController.js';

const router = Router();

router.post('/login', login);
router.post('/create', createNewTeller);

export default router;