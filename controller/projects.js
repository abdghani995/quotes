const Projects = require("../models/projects");

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
    },

    toggleProjectFavourite: (req, res, next) => {
        if(!req.body.status) {
            res.json({"success": false, "message": "Status missing"});
        }else{
            Projects.find({projectid: req.params.projectid}, {_id:0}, (err, projectData) =>{
                if(err){
                    return res.status(200).json({"success":false, "message":err});
                    return next();
                }else{
                    projectData.favourite = req.body.status;
                    projectData.save((err, data) => {
                        console.log(err, data);
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
};