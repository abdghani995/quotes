const Todo = require("../models/todo");
const jwt = require("jwt-simple");
const { NotExtended } = require("http-errors");

module.exports = {
    addTodo: (req, res, next) => {
        if(!req.body.title || !req.body.content) {
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
    }
}