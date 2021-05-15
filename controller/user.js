const User = require("../models/users");
const jwt = require("jwt-simple");

module.exports = {
    addUser: (req, res) => {
        if(!req.body.username || !req.body.password) {
            res.json({"success": false, "message": "Enter all fields"});
        }else{
            var user = User(req.body);
            user.save((err, newUser) => {
                // console.log(err, newUser);
                if(err){
                    res.json({"success": false,"message":"Failed saving users", "description": err});
                }else{
                    res.json({"success": true, "message": "User saved successfully"});
                }
            })
        }
    },
    loginUser : async(req, res) => {
        User.findOne({username: req.body.username},{_id:0}, (err, user) => {
            if(err) throw err;
            if(!user){
                res.status(403).json({success:true, msg: 'Authentication Failed, User not found'});
            }else{
                user.comparePwd(req.body.password, (err, isMatch) => {
                    if(isMatch && !err){
                        const token =  jwt.encode(user.repr(), process.env.MY_SECRET);
                        res.json({sucess:true, token:token})
                    }else{
                        return res.status(403).json({success:false, msg: 'Authentication failed, wrong pwd'});
                    }
                })
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
                return res.status(401).json({"error":"Unauthorized user"});
                next("Unauthorixed");
            }
        }catch(err){
            return res.status(401).json({"error":"Unauthorized user"});
            next("Unauthorixed");
        }
    },

    userInfo: (req, res, next) => {
        res.json(req.user);
        return next();
    }
}