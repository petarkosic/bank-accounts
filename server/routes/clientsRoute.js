import { Router } from 'express';
import { getAllClients, getClient, changeAddress } from './../controllers/clientsController.js';

const router = Router();

router.get('/', getAllClients);
router.get('/:id', getClient);
router.put('/change-address/:id', changeAddress);

export default router;
