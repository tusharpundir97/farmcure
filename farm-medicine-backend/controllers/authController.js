import User from "../models/User.js";
import generateToken from "../utils/generateTokens.js";

export const registerUser = async (req, res)=>{
      const {name,email,password,role}=req.body;
      try {
            const userExists = await User.findOne({email});
            // console.log(userExists);
            
            if(userExists) return res.status(400).json({message:"User Already Exists "});

            const user = await User.create({name, email, password, role});
            res.status(201).json({
                  _id:user._id,
                  name: user.name,
                  email:user.email,
                  role:user.role,
                  token:generateToken(user._id,user.role)
            });
            
      } catch (error) {
            console.log(error);
            
            res.status(500).json({message: error.message});
      }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};