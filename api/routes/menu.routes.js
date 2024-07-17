import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { createMenu,getMenu, updateMenu,deleteMenu } from "../controllers/menu.controllers.js";



const router = Router();

router.post("/createMenu",verifyJWT,createMenu)
router.get("/getMenu",getMenu);
router.post("/updateMenu/:userId/:menuId",verifyJWT,updateMenu)
router.delete("/deleteMenu/:userId/:menuId",verifyJWT,deleteMenu)

export default router;