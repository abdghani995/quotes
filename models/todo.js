const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uid = require("uuid");

var todoSchema = new mongoose.Schema({
    userid: {
        type: String,
        default: ""
    },
    projectid: {
        type: String,
        default: ""
    },
    todoid: {
        type: String,
        default: () => uid.v4()
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: false
    },
    status: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        require: false
    }
});

todoSchema.methods.repr = function(){
    return {
        "projectid": this.projectid,
        "userid": this.userid,
        "title": this.title,
        "content": this.content,
        "status": this.status,
        "created": this.created,
        "updated": this.updated
    }
}

module.exports = mongoose.model('Todo', todoSchema);