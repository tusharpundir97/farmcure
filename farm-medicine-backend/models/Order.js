import mongoose from "mongoose";

const orderItemSchema =new mongoose.Schema({
      product: {type: mongoose.Schema.Types.ObjectId,  ref:"Product",required:true},
      name:{type: String},
      qty: {type:Number, required:true},
      price: {type:Number, required: true},
})

const orderSchema =new mongoose.Schema({
      buyer:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
      seller:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
      items: [orderItemSchema],
      shippingAddress: {
            address:String,
            city: String,
            state: String,
            postalCode: String,
            country:String
      },
      paymentMethod: {type:String,default: "cod"},
      paymentResult: {id:String,status:String,update_time:String,email_address:String},
      itemsPrice: {type:Number,required:true},
      shippingPrice: {type:Number,default:0},
      totalPrice: {type:Number,required:true},
      status: {type:String, enum:["Pending","Shipped","Delivered"],default:"Pending"}
},{timestamps:true});

export default mongoose.model("Order", orderSchema);