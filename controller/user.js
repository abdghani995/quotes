const User = require("../models/users");
const Projects = require("../models/projects");
const Notes = require("../models/notes");
const Todo = require("../models/todo");
const jwt = require("jwt-simple");
const async = require("async");

let userSocialOps = async (req, res) => {
    // social login saves users data without password 
    // and generates a token based on basic data
    let _user = JSON.parse(req.body.user); 
    let foundUser = await User.findOne({username: _user['email']}).exec();
    if(foundUser == null){
        foundUser = User({
            "name":_user['displayName'],
            "username":_user['email'],
            "uid":_user['uid'],
            "displayImage":_user['photoURL'],
            "userType": "social"
        })
        await foundUser.save();
    }
    const token =  jwt.encode(foundUser.loginRepr(), process.env.MY_SECRET);
    res.json({success:true, token:token})
}

let loginUser = async(req, res) => {
    let user = await User.findOne({username: req.body.username}).exec();
    if(user == null){
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
}

let userInfo = async(req, res) => {
    let foundUser = await User.findOne({username: req.user['username']}).exec();
    foundUser = foundUser.infoRepr();
    foundUser['projectsCnt'] = await Projects.count({userid:req.user.uid}).exec();
    foundUser['notesCnt'] = await Notes.count({userid:req.user.uid}).exec();
    foundUser['todosCnt'] = await Todo.count({userid:req.user.uid}).exec();

    return res.json(foundUser);
}

let authenticateUser = (req, res, next) => {
    // console.log(req.headers);
    try{
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            let token = req.headers.authorization.split(' ')[1];
            let decodeToken = jwt.decode(token, process.env.MY_SECRET);
            req.user = decodeToken;
            next();
        }else{
            return res.status(401).json({"error":"Unauthorized user"});
            next("Unauthorized");
        }
    }catch(err){
        return res.status(200).json({"error":err});
        next("Unauthorixed");
    }
}

let addUser = async (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.json({"success": false, "message": "Enter all fields"});
    }else{
        var newUser = User(req.body);
        await newUser.save();
        if(newUser != null){
            res.json({"success": true, "message": "User saved successfully"});
        }else{
            res.json({"success": false,"message":"Failed saving users"});
        }
    }
}

let profileImage = async(req, res) => {
    let foundUser = await User.findOne({username: req.user['username']}).exec();
    foundUser.displayImage =req.file.location;
    await foundUser.save(); 
    console.log(process.env.AWS_ID);
    return res.json({"url": req.file.location});
}

module.exports = {
    addUser: addUser,
    userSocialOps: userSocialOps,
    loginUser : loginUser,
    userInfo: userInfo,
    authenticate: authenticateUser,
    profileImage: profileImage
}