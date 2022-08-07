import { Router } from 'express';
import { getAllClients, getClient, changeAddress, switchAccount } from './../controllers/clientsController.js';

const router = Router();

router.get('/', getAllClients);
router.get('/:id', getClient);
router.put('/change-address/:id', changeAddress);
router.put('/switch-account/:id', switchAccount);

export default router;
