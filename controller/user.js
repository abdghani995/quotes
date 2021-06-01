var admin = require('firebase-admin');

const Projects = require("../models/projects");
const User = require("../models/users");
const Notes = require("../models/notes");
const Todo = require("../models/todo");
const jwt = require("jwt-simple");
const async = require("async");


// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert('fbase.json'),
    storageBucket: 'snaps-a025b.appspot.com'
})
// Cloud storage
const bucket = admin.storage().bucket()

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
    // let foundUser = await User.findOne({username: req.user['username']}).exec();
    // foundUser.displayImage =req.file.location;
    // await foundUser.save(); 
    // console.log(process.env.AWS_ID);
    // return res.json({"url": req.file.location});
    if(!req.file) {
        res.status(400).send("Error: No files found")
    } else {
        let fname = new Date().toISOString()+req.file.originalname;
        var url = 'https://firebasestorage.googleapis.com/v0/b/snaps-a025b.appspot.com/o/'+fname + '?alt=media'
        const blob = bucket.file(fname);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
        blobWriter.on('error', (err) => {
            console.log(err)
        });
        blobWriter.on('finish', () => {
            return res.status(200).json({"url": url})
        });
        blobWriter.end(req.file.buffer);
    }
}

module.exports = {
    addUser: addUser,
    userSocialOps: userSocialOps,
    loginUser : loginUser,
    userInfo: userInfo,
    authenticate: authenticateUser,
    profileImage: profileImage
}