const Note = require("../models/notes");

const updateANote = async (req, res, next) => {
    try{
        _note = await Note.findOne({noteid:req.params.note_id}).exec();
        if(!_note){
            return res.json({"success": false, "error": "Error fetching notes"});
            return next();
        }else{
            _note.title = req.body.title;
            _note.content = req.body.content;
            _note.updated = Date();
            await _note.save();
            return res.json({"success": true, "message": "Note Updated successfully"});
            return next();
        }
    }catch(err){
        return res.json({"success": false, "error": err})
        return next();
    }
}

const archieveANote = async (req, res, next) => {
    try{
        _note = await Note.findOne({noteid:req.params.note_id}).exec();
        if(!_note){
            return res.json({"success": false, "error": "Error fetching notes"});
            return next();
        }else{
            _note.isArcheived = req.body.status;
            await _note.save();
            return res.json({"success": true, "message": "Note Updated successfully"});
            return next();
        }
    }catch(err){
        return res.json({"success": false, "error": err})
        return next();
    }
}

module.exports = {
    // add a new note to a project
    addNotes: (req, res, next) => {
        if(!req.body.content || !req.body.title) {
            res.json({"success": false, "message": "Enter all required fields(title, content)"});
        }else{
            var note = Note({
                "projectid": req.params.project_id,
                "title": req.body.title,
                "content": req.body.content
            });
            note.save((err, _note) => {
                if(err){
                    return res.json({"success": false,"message":"Failed saving note", "description": err});
                    return next();
                }else{
                    return res.json({"success": true, _note});
                    return next();
                }
            })
        }
    },

    // fetch prjects
    fetchNotes: (req, res, next) => {
        isArcheived = req.query.archieved || false;
        
        Note.find({projectid: req.params.project_id, isArcheived:isArcheived})
            .sort({ created : -1})
            .exec((err, notes) =>{
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
                return res.status(200).json({"success":false, "error":"error fetching note"});
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
                    
                    if(err) { res.status(400).json({"success":false, "message":"Error saving notes" ,"err": err})}
                    else{
                        return res.json({"success": true, "message": "Note updated successfully"})
                        return next();
                    }
                });
            }
        })
    },

    updateANote: updateANote,
    archieveANote: archieveANote

};