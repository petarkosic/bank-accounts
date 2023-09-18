import { Router } from 'express';
import {
    getAllClients,
    getClient,
    changeAddress,
    switchAccount,
    searchByAccountNumber,
    createClient,
    getAccountNumber,
    showPremiumCustomersByCountry,
    customersToReachCardLimit
} from './../controllers/clientsController.js';

const router = Router();

router.get('/search', searchByAccountNumber);
router.get('/', getAllClients);
router.get('/get-account-number', getAccountNumber);
router.get('/premium', showPremiumCustomersByCountry);
router.get('/card-limit', customersToReachCardLimit);
router.get('/:id', getClient);
router.put('/change-address/:id', changeAddress);
router.put('/switch-account/:id', switchAccount);
router.post('/create-client', createClient);

export default router;
