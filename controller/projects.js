const Projects = require("../models/projects");
const Notes = require("../models/notes");
const Todo = require("../models/todo");


const fetchProjectData = async function(req, res, next) {
    let project = {}
    projectData = await Projects.findOne({projectid: req.params.project_id}, {_id:0,__v:0}).exec();
    if (projectData != null){
        let noteCount = await Notes.count({projectid:projectData.projectid}).exec();
        let todoCount = await Todo.count({projectid:projectData.projectid}).exec();
        project['info'] = projectData
        project['notes'] = noteCount;
        project['todo'] = todoCount;
        return res.status(200).json(project);
        return next();
    }else{
        res.status(200).json({"success":false, "message":"Project not found "});
        return next()
    }
}

module.exports = {
    // add a new project for a user
    addProject: (req, res, next) => {
        if(!req.body.title || !req.body.description) {
            res.json({"success": false, "message": "Enter all required fields(title, description)"});
        }else{
            var project = Projects({
                "userid": req.user.uid,
                "title": req.body.title,
                "description": req.body.description,
            });
            project.save((err, _project) => {
                if(err || _project == null){
                    return res.json({"success": false,"message":"Failed saving project", "description": err});
                    return next();
                }else{
                    return res.json({"success": true, _project});
                    return next();
                }
            })
        }
    },

    // fetch prjects
    fetchProjects: (req, res, next) => {
        Projects.find({userid: req.user.uid}) 
            // {_id:0, userid:0,__v:0},
            .select()
            .sort({ created : -1})
             .exec((err, projectData) =>{
            if(err){
                return res.status(501).send("Some error");
                return next();
            }else{
                return res.json(projectData);
                return next();
            }
        })
    },

    toggleProjectFavourite: (req, res, next) => {
        if(!req.body.status) {
            res.json({"success": false, "message": "Status missing"});
        }else{
            Projects.findOne({projectid: req.params.project_id}, {}, (err, projectData) =>{
                if(err || projectData==null){
                    return res.status(200).json({"success":false, "message":err});
                    return next();
                }else{
                    projectData.favourite = req.body.status;
                    projectData.save((err, data) => {
                        if(err) { res.status(400).json({"success":false, "message":"Error saving Project" ,"err": err})}
                        else{
                            return res.json({"success": true, "message": "Project updated successfully"})
                            return next();
                        }
                    });
                }
            })
        }
    },

    fetchProjectData: fetchProjectData
};