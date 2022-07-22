import { Router } from 'express';
import { getAllClients, getClient } from './../controllers/clientsController.js';

const router = Router();

router.get('/', getAllClients);
router.get('/:id', getClient);

export default router;
