import User from "../model/usermodel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import { gentoken, genToken1 } from "../config/token.js";

export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({ message: 'User already exist' })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Enter valid email address' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Enter strong password' })
        }

        let hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashPassword })
        let token = await gentoken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json(user)

    } catch (error) {
        console.log("error in registration")
        return res.status(500).json({ message: `Register error ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let _user = await User.findOne({ email })

        if (!_user) {
            return res.status(400).json({ "message": "User not found" })
        }
        let isMatch = await bcrypt.compare(password, _user.password)

        if (!isMatch) {
            return res.status(400).json({ "message": "Incorrect Password" })
        }
        let token = await gentoken(_user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ "message": "login successfull" })

    } catch (error) {
        console.log("login error")
        return res.status(500).json({ "message": `login error ${error}` });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({"message": "logout successful"})
    } catch (error) {
        console.log("logout error")
        return res.status(500).json({ "message": `logout error ${error}` });
    }
}

export const googleLogin = async (req,res) => {
    try {
        let {name , email} = req.body;
         let user = await User.findOne({email}) 
        if(!user){
          user = await User.create({
            name,email
        })
        }
       
        let token = await gentoken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(user)

    } catch (error) {
         console.log("googleLogin error")
    return res.status(500).json({message:`googleLogin error ${error}`})
    }
    
}

export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = await genToken1(email)
        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invaild creadintials"})

    } catch (error) {
        console.log("AdminLogin error")
    return res.status(500).json({message:`AdminLogin error ${error}`})
        
    }
    
}