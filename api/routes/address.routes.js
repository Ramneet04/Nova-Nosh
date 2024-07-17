import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { getAddress, pinCode, saveAddress } from "../controllers/address.controller.js";
const router = Router();

router.post("/pinCode",verifyJWT,pinCode);
router.post("/saveAddress",verifyJWT,saveAddress);
router.get("/getAddress",verifyJWT,getAddress);
export default router;