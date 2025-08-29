import Product from "../models/Product.js";

// create Product (seller only)
export const createProduct= async (req,res)=>{
      try {
            const data =req.body;
            
            data.seller=req.user._id;
            
            if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => file.path);
             }
            const product=await Product.create(data);
            res.status(201).json(product);
      } catch (err) {
            console.log(err);
            
            res.status(500).json({message:err.message})
      }
}

// update product(seller or admin)
export const updateProduct =async (req,res)=>{
      try {
           const product =await Product.findById(req.params.id);
           if(!product) return res.status(404).json({message:"Product Not Found"});
           if(req.user.role !=="admin" && product.seller.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not Allowed"});
           } 
           Object.assign(product,req.body);
           const updated =await product.save();
           res.json(updated);
      } catch (error) {
            res.status(500).json({message:error.message});
      }
}

// get Product by id
export const getProductById = async (req, res)=>{
      try {
            const product =await Product.findById(req.params.id).populate("seller","name email");
            if(!product) return res.status(404).json({message:"Product Not Found"});
            res.json(product)

      } catch (error) {
            res.status(500).json({message:error.message})
      }
}

// List product 
export const listProducts = async (req,res)=>{
      try {
           const pageSize =Number(req.query.limit) || 12;
           const page =Number(req.query.page) ||1;
           const keyword=req.query.keyword 
                  ?{name:{$regex:req.query.keyword,$options: "i"}}
                  :{};
            
            const category =req.query.category?{category:req.query.category}:{};
            const minPrice =req.query.minPrice?{price:{$gte:Number(req.query.minPrice)}}:{};
            const maxPrice =req.query.maxPrice?{price:{...(minPrice.price||{}),$lte:Number(req.query.maxPrice)}}:{};
            const filter = {...keyword,...category,...minPrice,...maxPrice,verified:true};
            const count = await Product.countDocuments(filter);
            const products =await Product.find(filter)
            .skip(pageSize*(page-1))
            .limit(pageSize)
            .sort({createdAt: -1});
            res.json({products,page,pages:Math.ceil(count/pageSize),total:count});
           

            
      } catch (error) {
            res.status(500).json({message:error.message});
      }
}

// Seller: list own products
export const listSellerProducts =async (req,res) => {
      try {
            const products= await Product.find({seller: req.user._id}).sort({createdAt: -1});
            res.json(products);
      } catch (error) {
            res.status(500).json({message:error.message});
      }
}

// seller verifiactaion
export const verifyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.verified = true;
    await product.save();

    res.json({ message: "Product verified successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin get all unverified products
export const listUnverifiedProducts =async (req,res) => {
      try {
            const products = await Product.find({verified:false}).populate("seller","name email");
            res.json(products);
      } catch (err) {
                res.status(500).json({ message: err.message });
      }
}

export const bulkVerifyProducts =async (req,res)=>{
      try {
            const {productIds} =req.body;
            if(!Array.isArray(productIds) ||productIds.length ===0){
                  return res.status(400).json({message:"No product id is provide"});
            }
            const updated =await Product.updateMany(
                  {_id: {$in:productIds}},
                  {$set: {verified: true}}
            )
            res.json({message: `${updated.modifiedCount} products verified successfully`})
      } catch (err) {
                res.status(500).json({ message: err.message });

      }
} 