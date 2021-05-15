let JwtStrategy =require("passport-jwt").Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let User = require("../models/users");

module.exports = (passport) => {
    let opts = {};
    opts.secretOrKey = process.env.MY_SECRET;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("=====================");
        console.log(jwt_payload)
        console.log("=====================");
        // console.log(jwt_payload);
        User.find({id:jwt_payload.id}, (err,user) => {
            if(err){
                return done(err, false);
            }if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        })
    }))
}
