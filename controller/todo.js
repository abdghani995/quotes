const Todo = require("../models/todo");
const jwt = require("jwt-simple");
const { NotExtended } = require("http-errors");
const todo = require("../models/todo");

// add a new todo to a project
let addProjectTodo = async (req, res, next) => {
    if(!req.body.title) {
        res.json({"success": false, "message": "Enter all fields"});
    }else{
        try{
            _todo = Todo({
                "userid": req.user.uid,
                "projectid": req.params.project_id,
                "title": req.body.title,
                "content": req.body.content,
            });
            await _todo.save();
            return res.json({"success": true, _todo});
            return next();

        }catch(err){
            return res.json({"success": false,"message":"Failed saving todo", "description": err});
            return next();
        }
    }
}

let getProjectTodo = async (req, res, next) => {
    try{
        todos = await Todo.find({projectid:req.params.project_id},{_id:0,__v:0}).sort({ created : -1}).exec();
        return res.json( todos);
        return next();
    }catch(err){
        return res.json({"success": false,"message":"error fetching todo", "description": err});
        return next();
    }
}

module.exports = {
    // add a todo for a user
    addTodo: (req, res, next) => {
        if(!req.body.title) {
            res.json({"success": false, "message": "Enter all fields"});
        }else{
            var todo = Todo({
                "userid": req.user.uid,
                "title": req.body.title,
                "content": req.body.content,
            });
            todo.save((err, newTodo) => {
                if(err){
                    return res.json({"success": false,"message":"Failed saving todo", "description": err});
                    return next();
                }else{
                    return res.json({"success": true, "message": "Todo saved successfully"});
                    return next();
                }
            })
        }
    },

    // fetch todo of a user
    fetchTodo: (req, res, next) => {
        Todo.find({userid: req.user.uid}, {_id:0, userid:0,__v:0}, (err, todoData) =>{
            if(err){
                return res.status(501).send("Some error");
                return next();
            }else{
                return res.json(todoData);
                return next();
            }
        })
    },

    // update a todo status by id
    updateTodo: function (req, res, next) {
        if(!req.body.todoid || !req.body.status) {
            res.status(400).json({status:false, message:"Invalid Data"});
            return next();
        }else{
            Todo.findOne({todoid: req.body.todoid}, {}, (err, todoData) => {
                if(err || todoData == null){
                    return res.status(501).send({"success": false, "message": "Error fetching todo"});
                    return next();
                }else if(todoData.userid != req.user.uid){
                    return res.status(401).send("Invalid user");
                    return next();
                }else{
                    todoData.status = req.body.status;
                    todoData.updated = new Date();
                    todoData.save((err, data) => {
                        if(err) { res.status(400).json({"success":false, "message":"Error saving data"})}
                        else{
                            return res.json({"success": true, "todo": todoData.repr()})
                            return next();
                        }
                    });
                }
            })
        }
    },

    addProjectTodo: addProjectTodo,
    getProjectTodo: getProjectTodo
}