const {roles} = require('../roles/roles');
const jwt  = require('jsonwebtoken')
const user = require("../models/userModel")

const accessCheck = function(action,resource){
    return async function(req,res,next){
        const permission = roles.can(req.user.role)[action](resource);
        if(!permission.granted){
            return res.status(403).send({"status":false,msg: "You are not authorised to do this task"});
        }
        next()
    }
}
const loginCheck = async function(req,res,next){
    if (req.headers["x-api-key"]) {
    const accessToken = req.headers["x-api-key"];
    const { userId, exp } =  jwt.verify(accessToken,"TheQuickBrownFox");
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) { 
     return res.status(401).send({ error: "JWT token has expired, please login to obtain a new one" });
    } 
    req.user = await user.findById(userId); 
    next(); 
   } else { 
        return res.status(401).send({status:false,msg:"You need to login first"})
   } 
}
module.exports.accessCheck = accessCheck;
module.exports.loginCheck = loginCheck;
