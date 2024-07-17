import { Router } from "express";
import { addToWhistList ,getWhistList, status } from "../controllers/whistList.controller.js";
const router = Router();


router.post('/addWhistList/:userId/:menuId',addToWhistList);
router.get('/getWhistList/:userId',getWhistList);
router.get('/getStatus/:userId/:menuId',status);
export default router;