import { Router } from 'express';
import {
    depositOrWithdraw,
    sendMoney
} from './../controllers/moneyTransferController.js';

const router = Router();

router.put('/deposit/:id', depositOrWithdraw);
router.post('/send-money', sendMoney);

export default router;
