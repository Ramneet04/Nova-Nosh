import asyncHandler from "../helper/asyncHandler.js";
import apiResponse from "../helper/apiResponse.js";
import ApiError from "../helper/apiError.js";
import User from "../models/user.model.js";
import Order from "../models/orders.models.js";
import OrderStatus from "../models/orderStatus.models.js";
import Menu from "../models/menu.model.js";
export const getOrder = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res
                .status(404)
                .json(new apiResponse({}, "Please login ", 404));
        }

        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        let startIndex = (page - 1) * limit;
        if (req.query.startIndex) {
            startIndex = parseInt(req.query.startIndex);
        }
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const order = await Order.find({
             user: userId ,
             ...(req.query.orderId && { _id: req.query.orderId })
            
            }).sort({ createdAt: sortDirection }).limit(limit).skip(startIndex);

        if (!order) {
            return res
                .status(404)
                .json(new apiResponse({}, "Order not found", 404));
        }

       

     
        return res
            .status(200)
            .json(new apiResponse(order, "Order fetched successfully", 200));
        
    } catch (error) {
        throw new ApiError(500, "Error in fetching Order : " + error.message);
    }});

export const allOrder = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = await User.findById(userId);
        if(userData.isAdmin){
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            let startIndex = (page - 1) * limit;
            if (req.query.startIndex) {
                startIndex = parseInt(req.query.startIndex);
            }
            const sortDirection = req.query.order === "asc" ? 1 : -1;
    
          
            const order = await Order.find().sort({ createdAt: sortDirection }).limit(limit).skip(startIndex);

            const totalOrder = await Order.countDocuments();
            const now = new Date();
            const one_month_ago = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
        
            const lastMonthOrder = await Order.countDocuments({
              createdAt: { $gte: one_month_ago },
            });
            if (order) {
                return res
                .status(200)
                .json(new apiResponse({order , totalOrder,lastMonthOrder}, "Order fetched successfully", 200));
            }
        }else{
            return res
            .status(404)
            .json(new apiResponse({}, "You are not admin", 404));
        } 
    } catch (error) {
        throw new ApiError(500, "Error in fetching Order : " + error.message);
    }});

export const updateOrder = asyncHandler(async (req, res) => {
    try {
        const orderId = req.params._id;
      
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );

        
        const isOrderStatus = await OrderStatus.findOne({
            orderId: orderId,
        });

        if(isOrderStatus){
            isOrderStatus.statusDetails.push({status: req.body.orderStatus, updated_at: new Date()});
            await isOrderStatus.save();
        }

        else{
        const orderStatus = await OrderStatus.create({
            orderId: orderId,
            statusDetails: [{status: req.body.orderStatus, updated_at: new Date()}]
        })};
    
       
        if (order) {
            return res
            .status(200)
            .json(new apiResponse({}, "Order updated successfully", 200));
        }
        else{
            return res
            .status(404)
            .json(new apiResponse({}, "Order not found", 404));
        }
       

        
    } catch (error) {
        throw new ApiError(500, "Error in fetching Order : " + error.message);
    }
})
export const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const orderId = req.params._id;
        const order = await
        Order.findByIdAndDelete(orderId);
        if(order){
            return res
            .status(200)
            .json(new apiResponse(order, "Order deleted successfully", 200));
        }
        else{
            return res
            .status(404)
            .json(new apiResponse({}, "Order not found", 404));
        }
    }
    catch (error) {
        throw new ApiError(500, "Error in fetching Order : " + error.message);
    }
}
)

export const orderStatus = asyncHandler(async (req, res) => {
    try {
        const orderId = req.params._id;
        const orderStatus = await OrderStatus.find({orderId:orderId});
        if(orderStatus){
            return res
            .status(200)
            .json(new apiResponse(orderStatus, "Order status fetched successfully", 200));
        }
        else{

            const order = await OrderStatus.create({
                orderId: orderId,
                statusDetails: [{status: "Pending", updated_at: new Date()}]
            });
            return res
            .status(200)
            .json(new apiResponse(order, "Order status fetched successfully", 200));
        }
    }
    catch (error) {
        throw new ApiError(500, "Error in fetching Order : " + error.message);
    }
}
)


export const Totals = asyncHandler(async (req, res) => {
    try {
        const totalUser = await User.countDocuments();
        const totalOrder = await Order.countDocuments();
        const totalMenu = await Menu.countDocuments();
        
        return res
        .status(200)
        .json(new apiResponse({totalUser,totalOrder,totalMenu}, "Total fetched successfully", 200));
        
    } catch (error) {
        throw new ApiError(500, "Error in fetching Data" );
    }
})