import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../util/generateToken.js";

export const signup = async (req, res) => {
    try {

        console.log(req.body); 

        const { fullname, email, username, password, confirmpass } = req.body;

        if (password !== confirmpass) {
            return res.status(400).json({ error: "Passwords Don't Match!" });
        }

       
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePhoto = "/uploads/default.jpg";

        const newUser = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword,
            profilePhoto: profilePhoto
        });

        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({ message: "User created successfully!", user: newUser });
        }else{
            res.status(400).json({error: "Invalid User Data"});
        }
        
        
    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    
    console.log(req.body);

    try {
        const {username, password } = req.body;

        const user = await User.findOne({username});
        if(user)
        {
            const ispasscorrect = await bcrypt.compare(password, user.password || ""); // returns true,,if not false.. if password int provided or null the second argument will be used by the function ensuring it handles the errors
            
            if(ispasscorrect)
            {
                generateTokenAndSetCookie(user._id,res);
                res.status(200).json({user:user});
            }else{
                res.status(400).json({error: "Invalid Username or password"});
            }
        }else{
            res.status(400).json({error: "Invalid Username or password"});
        }
        

        

    } catch (error) {
        console.log("Error in Login Controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out Successfully"});
    }catch(error)
    {
        console.log("Error in Logout Controller : ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
