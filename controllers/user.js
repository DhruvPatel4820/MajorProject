const User = require("../models/user")
module.exports.renderSignUpform = (req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser = new User({email,username});
        let registerdUser = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust")
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderloginform = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are successfully logged out");
        res.redirect("/listings");
    })
}