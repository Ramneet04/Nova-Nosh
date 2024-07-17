import { Router } from "express";
import { getOrder,allOrder,updateOrder,deleteOrder,orderStatus, Totals } from "../controllers/orders.controller.js";


const router = Router();

router.get("/order/:userId" , getOrder)
router.get("/allOrder/:userId" , allOrder)
router.patch("/updateOrder/:_id", updateOrder)
router.delete("/deleteOrder/:_id", deleteOrder)
router.get("/orderStatus/:_id", orderStatus)
router.get('/total',Totals)
export default router;