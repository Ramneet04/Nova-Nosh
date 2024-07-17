import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const cartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    ,
    menus:[{

       menu:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu',
        required:true
       },
         quantity:{
              type:Number,
              default:1
         },
         menuData: { 
            type: Object,
            required: true
          },
              
        }
    ],
    
    totalQuantity:{
        type:Number,
        default:1
    },
   

},
{timestamps:true}
)

const Cart = mongoose.model('Cart',cartSchema);

export default Cart;