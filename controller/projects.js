const Projects = require("../models/projects");

module.exports = {
    // add a new project for a user
    addProject: (req, res, next) => {
        if(!req.body.title) {
            res.json({"success": false, "message": "Enter all required fields(title)"});
        }else{
            var project = Projects({
                "userid": req.user.uid,
                "title": req.body.title,
                "description": req.body.description,
            });
            project.save((err, newProject) => {
                if(err){
                    return res.json({"success": false,"message":"Failed saving project", "description": err});
                    return next();
                }else{
                    return res.json({"success": true, "message": "Project saved successfully"});
                    return next();
                }
            })
        }
    },

    // fetch prjects
    fetchProjects: (req, res, next) => {
        Projects.find({userid: req.user.uid}, {_id:0, userid:0,__v:0}, (err, projectData) =>{
            if(err){
                return res.status(501).send("Some error");
                return next();
            }else{
                return res.json(projectData);
                return next();
            }
        })
    }
};