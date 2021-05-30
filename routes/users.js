let userController = require("../controller/user");
let todoController = require("../controller/todo");
let projectController = require("../controller/projects");
let router = require('express').Router();

router.post('', userController.addUser);
router.post('/social', userController.userSocialOps);

router.post('/login', userController.loginUser);
router.get('/info', userController.authenticate, userController.userInfo);

router.get('/todo', userController.authenticate, todoController.fetchTodo);
router.post('/todo', userController.authenticate, todoController.addTodo);
router.put('/todo', userController.authenticate, todoController.updateTodo);

router.post('/projects', userController.authenticate, projectController.addProject);
router.get('/projects', userController.authenticate, projectController.fetchProjects);

module.exports = router;
