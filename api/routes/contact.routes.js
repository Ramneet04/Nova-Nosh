import { Router } from "express";
import { sendContactEmail } from "../controllers/contactEmail.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";



const router = Router();

router.post("/contact", sendContactEmail);
export default router;