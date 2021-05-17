const Note = require("../models/notes");

module.exports = {
    // add a new note to a project
    addNotes: (req, res, next) => {
        if(!req.body.content || !req.body.title) {
            res.json({"success": false, "message": "Enter all required fields(title, content)"});
        }else{
            console.log(req.body);
            var note = Note({
                "projectid": req.params.project_id,
                "title": req.body.title,
                "content": req.body.content
            });
            note.save((err, note) => {
                if(err){
                    return res.json({"success": false,"message":"Failed saving note", "description": err});
                    return next();
                }else{
                    return res.json({"success": true, "message": "Note saved successfully"});
                    return next();
                }
            })
        }
    },

    // fetch prjects
    fetchNotes: (req, res, next) => {
        Note.find({projectid: req.params.project_id}, {_id:0, projectid:0,__v:0, content:0}, (err, notes) =>{
            if(err){
                return res.status(501).send("Some error");
                return next();
            }else{
                return res.json(notes);
                return next();
            }
        })
    },

    // fetch a note
    fetchANote: (req, res, next) => {
        Note.findOne({noteid: req.params.note_id}, {_id:0, __v:0, }, (err, note) =>{
            if(err || note == null){
                return res.status(501).send("Some error");
                return next();
            }else{
                return res.json(note);
                return next();
            }
        })
    },

    updateFavourite: (req, res, next) => {
        Note.findOne({noteid: req.params.note_id}, { __v:0, }, (err, note) =>{
            if(err || note == null){
                return res.status(200).json({"success":false, "message":err});
                return next();
            }else{
                note.favourite = req.body.status;
                note.save((err, data) => {
                    console.log(err, data);
                    if(err) { res.status(400).json({"success":false, "message":"Error saving notes" ,"err": err})}
                    else{
                        return res.json({"success": true, "message": "Note updated successfully"})
                        return next();
                    }
                });
            }
        })
    }

};