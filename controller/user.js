const User = require("../models/users");
const jwt = require("jwt-simple");

let userSocialOps = async (req, res) => {
    let _user = JSON.parse(req.body.user);
    
    let foundUser = await User.findOne({username: _user['email']}).exec();
    if(foundUser == null){
        foundUser = User({
            "name":_user['displayName'],
            "username":_user['email'],
            "uid":_user['uid'],
            "userType": "social"
        })
        await foundUser.save();
    }
    const token =  jwt.encode(foundUser.loginRepr(), process.env.MY_SECRET);
    res.json({success:true, token:token})
    // console.log(foundUser.loginRepr());
    // res.send(_user);
}

module.exports = {
    addUser: (req, res) => {
        if(!req.body.username || !req.body.password) {
            res.json({"success": false, "message": "Enter all fields"});
        }else{
            var user = User(req.body);
            user.save((err, newUser) => {
                if(err){
                    res.json({"success": false,"message":"Failed saving users", "description": err});
                }else{
                    res.json({"success": true, "message": "User saved successfully"});
                }
            })
        }
    },

    userSocialOps: userSocialOps,

    loginUser : async(req, res) => {
        User.findOne({username: req.body.username},{_id:0}, (err, user) => {
            if(err) throw err;
            if(!user){
                res.status(403).json({success:false, "message": 'Authentication Failed, User not found'});
            }else{
                if(user.userType == 'general'){
                    user.comparePwd(req.body.password, (err, isMatch) => {
                        if(isMatch && !err){
                            const token =  jwt.encode(user.loginRepr(), process.env.MY_SECRET);
                            res.json({success:true, token:token})
                        }else{
                            return res.status(403).json({success:false, "message": 'Authentication failed, wrong pwd'});
                        }
                    })
                }else{
                    return res.status(403).json({success:false, "message": 'Please use social methods to login for this user'});
                }
            }
        })
    },
    
    authenticate:(req, res, next) => {
        try{
            if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
                let token = req.headers.authorization.split(' ')[1];
                let decodeToken = jwt.decode(token, process.env.MY_SECRET);
                req.user = decodeToken;
                next();
            }else{
                console.log("--1");
                return res.status(401).json({"error":"Unauthorized user"});
                next("Unauthorixed");
            }
        }catch(err){
            return res.status(200).json({"error":err});
            next("Unauthorixed");
        }
    },

    userInfo: (req, res, next) => {
        res.json(req.user);
        return next();
    }
    
}