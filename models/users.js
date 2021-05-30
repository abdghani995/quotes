const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uid = require("uuid");

var userSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: () => uid.v4()
    },
    name: {
        type: String,
        require: false,
        unique: false
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: String,
        default: "general"
    }
});

// prehook to create hash of a password
userSchema.pre("save",async function(next) {
    var user = this;
    console.log(user.password);

    if(user.password != undefined){
        if(user.isModified('password') || user.isNew){
            try{
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                return next();
            }catch(err){
                console.log(err);
                return next("Error saving user");
            }
        }else{
            return next();
        }
    }
})

// medthod to compare password
userSchema.methods.comparePwd = function(pwd, cb){
    bcrypt.compare(pwd, this.password, (err, isMatch) => {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.loginRepr = function(){
    const currentDate = new Date();
    return {
        "time": currentDate.getTime().toString(),
        "name": this.name,
        "username": this.username,
        "uid": this.uid
    }
}

module.exports = mongoose.model('User', userSchema);