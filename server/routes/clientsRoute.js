import { Router } from 'express';
import { getAllClients, getClient, changeAddress, switchAccount, depositOrWithdraw, searchByAccountNumber } from './../controllers/clientsController.js';

const router = Router();

router.get('/', getAllClients);
router.get('/:id', getClient);
router.get('/search', searchByAccountNumber);
router.put('/change-address/:id', changeAddress);
router.put('/switch-account/:id', switchAccount);
router.put('/deposit/:id', depositOrWithdraw);

export default router;
