import { Router } from 'express';
import { getAllClients, getClient, changeAddress, switchAccount, depositOrWithdraw, searchByAccountNumber, sendMoney, updateCardLimitAndWithdrawalFee, createClient, showPremiumCustomersByCountry, getAccountNumber } from './../controllers/clientsController.js';

const router = Router();

router.get('/search', searchByAccountNumber);
router.get('/update-limit', updateCardLimitAndWithdrawalFee);
router.get('/', getAllClients);
router.get('/get-account-number', getAccountNumber);
router.get('/:id', getClient);
router.get('/premium', showPremiumCustomersByCountry);
router.put('/change-address/:id', changeAddress);
router.put('/switch-account/:id', switchAccount);
router.put('/deposit/:id', depositOrWithdraw);
router.post('/send-money', sendMoney);
router.post('/create-client', createClient);

export default router;
