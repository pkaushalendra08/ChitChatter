import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

// Signup
export const Signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "User already exist with this email" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account created Successfully" })


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Login
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not exist with this email" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.json({ success: false, message: "Incorrect password" })
        }
        
        const token = generateToken(user._id)
        res.json({ success: true, userData: user, token, message: "Login Successful" })


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

//Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({success: true, user:req.user});
}


//Controller to Update Profile details
export const updateProfile = async(req, res)=>{
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName}, {new: true})
        }else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, { profilePic:upload.secure_url, bio, fullName }, { new: true});
        }
        res.json({success: true, user:updatedUser, message:"Profile is updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message});
    }
}