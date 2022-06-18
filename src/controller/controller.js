const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRound = 10; // Level of difficulty
const validate = require('../validation/validation')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;

const create = async function(req,res){
    if(!Object.keys(req.body).length) return res.status(400).send({"status":false,"msg":'please enter the details'});
    const userDetails = req.body;
    let {name,email,password,role} = req.body;
    // name , email, password are compulsory
    if( !name || !email || !password) return res.status(400).send({"status":false,"msg":"please enter the compulsory details"});
    // Proper Name validation
    if(!validate.isName(name)){
        return res.status(400).send({"status":false,"msg": "Enter the name in proper alphabetic format"})
    }
    // Proper Email Validation and uniqueness
    if(!validate.isEmail(email)){
        return res.status(400).send({"status":false,"msg" : "Enter the email in proper format, Eg. abc123@email.com"})
    }
    let dupEmail = await user.find({email});
    if(dupEmail.length >0){
        return res.status(400).send({"status":false, "msg" : "Email isalready present in the system, try login"})
    }

    //Proper password validation
    if(!validate.isPassword(password)){
        return res.status(400).send({status:false,msg:"Password length must be between 8 to 15 and it should contain one uppercase, one lowercase and one number atleast"})
    }
    // if role is given but not from ["intern","SDE1","SDE2","SDE3", "Admin"], set it to the default "intern"
    if(role){
        if(typeof role != "string" || !["intern","SDE1","SDE2","SDE3", "Admin"].includes(role.trim())){
            role = "intern";
            userDetails.role = "intern";
        }
    }
    // converting password into encrypted form;
    userDetails.password = await bcrypt.hash(password, saltRound);
    let userCreated = await user.create(userDetails);
    return res.status(201).send({"status":true,"msg":"User created successfully"});
}

const login = async function(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).send({"status":false,"msg":"Email and Password are mandatory"});
    }
    if(!validate.isEmail(email)){
        return res.status(400).sedn({"status":false,"msg":'Enter the valid email'})
    }
    let userDetails = await user.findOne({email});
    if(!userDetails){
        return res.status(400).send({"status":false,"msg" : "Email is not registered with us, please login"})
    } 
    let passwordMatch =  bcrypt.compareSync(password,userDetails.password)
    if(!passwordMatch){
        return res.status(401).send({"status" : false,"msg":"Email or Password is incorrect"})
    }
    const token = jwt.sign(
    {
        exp : Math.floor(Date.now()/1000) + 24*60*60, // 24 hours expiration time;
        userId : userDetails._id
    },
    "TheQuickBrownFox"
    );
    return res.status(200).send({"status":true,"msg" : "login successfully done","token" : token})

}

const read = async function(req,res){
    const objectId = req.params.userId;
    if(!ObjectId.isValid(objectId)){
        return res.status(400).send({"status":false,"msg":"ObjectId is not valid"});
    };
    let userDetails = await user.findById(objectId);
    if(!userDetails){
        return res.status(400).send({status:false,msg:"Unable to fetch the details at present"})
    }
    return res.status(200).send({"status":true,"msg" : "Profile Details","document" : userDetails})
}
const update = async function(req,res){
    if(!Object.keys(req.body).length){
        return res.status(400).send({status:false,msg : "Enter the details if you want to update"})
    }
    const {name,email,password,role} = req.body;
    const userId = req.params.userId;
    if(!ObjectId.isValid(userId)){
        return res.status(400).send({status:false,msg:"ObjectId is not valid"})
    }
    let userDetails = await user.findById(userId);
    let index = ["intern","SDE1","SDE2","SDE3", "Admin"].indexOf(userDetails);
    if(!userDetails){
        return res.status(400).send({status:false,msg:"check the objectId given in the query"})
    }
    if(name){
        if(!validate.isName(name)){
            return res.status(400).send({"status":false,"msg": "Enter the name in proper alphabetic format"})
        }
    };
    if(email){
        if(!validate.isEmail(email)){
            return res.status(400).send({"status":false,"msg" : "Enter the email in proper format, Eg. abc123@email.com"})
        }
        let dupEmail = await user.find({email});
        if(dupEmail.length >0){
            return res.status(400).send({"status":false, "msg" : "Email isalready present in the system, try login"})
        }
    }
    if(password){
        if(!validate.isPassword(password)){
            return res.status(400).send({status:false,msg:"Password length must be between 8 to 15 and it should contain one uppercase, one lowercase and one number atleast"})
        };
        let passwordMatch =  bcrypt.compareSync(password,userDetails.password)
        if(passwordMatch){
        return res.status(401).send({"status" : false,"msg":"Email or Password is incorrect"})
        }
    };
    if(role){
        //either role is not correct or 
        if(!["intern","SDE1","SDE2","SDE3", "Admin"].includes(role)){
            return res.status(400).send({status:false,msg:"Role is not from the valid positions "})
        }
        if(!["intern","SDE1","SDE2","SDE3", "Admin"].slice(0,index).includes(role)){
            return res.status(400).send({status:false,msg:"you are not authorized to change this role"})
        }
    }
    let updatedUserDetails = await user.findByIdAndUpdate(userId, {name:name,email : email,password:password,role : role}, {new : true});
    return res.status(200).send({status:true,msg:"details updated successfully"})

}


module.exports.create = create;
module.exports.login = login;
module.exports.read = read;
module.exports.update = update;