import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "15d",
    });

    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,
        httpOnly: true, //prevent cross-site scripting attcks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    })
};

export default generateTokenAndSetCookie;