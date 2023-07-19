const User=require("../model/userModel");
const brcypt= require("bcrypt");
module.exports.register = async (req,res,next) =>{
    try{
        console.log(req.body);    
        const { username,email, password }=req.body;
        const usernameCheck = await User.findOne({username});
         if(usernameCheck)
         return res.json({msg:"نام کاربری قبلاً استفاده شده است",status:false});
         const emailCheck= await User.findOne({password});
         if(emailCheck)
         return res.json({msg:"ایمیل قبلا استفاده شده است",status:false});   
   
         const hashedPassword= await brcypt.hash(password,10);  
         const user=await User.create({
            email,
            username,
            password:hashedPassword,
        });
        delete user.password;
        return res.json({status:true,user})
    }catch(ex){
        next(ex);
    }


};