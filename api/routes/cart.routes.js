import { Router } from "express";
import { addToCart,increaseQuantity,decreaseQuantity,removeFromCart,getCart } from "../controllers/cart.controller.js";


const route = Router();

route.post("/addToCart/:userId/:menuId" , addToCart)
route.put("/increment/:userId/:menuId",increaseQuantity )
route.put("/decrement/:userId/:menuId",decreaseQuantity )
route.delete("/remove/:userId/:menuId",removeFromCart )
route.get("/getCart/:userId",getCart)
export default route;