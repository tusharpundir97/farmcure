import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
      seller: {type: mongoose.Schema.Types.ObjectId , ref: "User",required: true},
      name: {type: String,required:true, trim:true},
      brand: {type: String},
      category: {type:String,required: true},
      description: {type: String},
      activeIngredients: {type:[String]},
      usage: {type:String},
      price: {type:Number, required: true},
      stock: {type:Number, default:0,required:true},
      images: [{type:String}],
      expiryDate: {type: Date},
      sku: {type:String, index:true},
      verified: {type:Boolean, default:false},
},{timestamps:true});


export default mongoose.model("Product",productSchema);

