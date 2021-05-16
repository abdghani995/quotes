const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uid = require("uuid");

var projectSchema = new mongoose.Schema({
    projectid: {
        type: String,
        default: () => uid.v4()
    },
    userid: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: false
    },
    favourite: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

projectSchema.methods.repr = function(){
    return {
        "projectid": this.projectid,
        "userid": this.userid,
        "title": this.title,
        "content": this.content,
        "favourite": this.favourite,
        "created": this.created,
        "updated": this.updated
    }
}

module.exports = mongoose.model('Project', projectSchema);