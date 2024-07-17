import Router from 'express';
import { order,capture } from '../controllers/payment.controller.js';

const router = Router();

router.post('/order',order);
router.post ('/capture',capture);
export default router;