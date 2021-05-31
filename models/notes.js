const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uid = require("uuid");

var notesSchema = new mongoose.Schema({
    projectid: {
        type: String,
        require: true
    },
    userid: {
        type: String,
        require: true
    },
    noteid: {
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
    favourite: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    isArcheived: {
        type: Boolean,
        default: false
    }
});

notesSchema.methods.repr = function(){
    return {
        "projectid": this.projectid,
        "noteid": this.noteid,
        "title": this.title,
        "content": this.content,
        "favourite": this.favourite,
        "created": this.created,
        "updated": this.updated
    }
}

module.exports = mongoose.model('Notes', notesSchema);