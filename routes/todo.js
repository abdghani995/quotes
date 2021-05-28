let router = require('express').Router();
let todoController = require("../controller/todo");
let userController = require("../controller/user");

router.delete('/:todoid', userController.authenticate, todoController.deleteTodo);
module.exports = router;
