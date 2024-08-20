const User = require("../models/userModel")

const isAdmin = async (req,res,next)=>{
    if (!req.session.userId){
        return res.redirect("/")
    }

    try{
        const user = await User.findById(req.session.userId)
        if (!user || user.role != 'admin'){
            return res.status(403).send("Access Denied.Only Admin are allowed")
        }
        next()
    }
    catch(err){
        console.error("Error Checking Admin Role: ",err)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {isAdmin}