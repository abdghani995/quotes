let userController = require("../controller/user");
let projectsController = require("../controller/projects");
let notesController = require("../controller/notes");
let todoController = require("../controller/todo");
let router = require('express').Router();

router.get('/:project_id/info', userController.authenticate, projectsController.fetchProjectData);
router.put('/:project_id/favourite', userController.authenticate, projectsController.toggleProjectFavourite);

router.post('/:project_id/notes', userController.authenticate, notesController.addNotes);
router.get('/:project_id/notes', userController.authenticate, notesController.fetchNotes);

router.post('/:project_id/todos', userController.authenticate, todoController.addProjectTodo);
router.get('/:project_id/todos', userController.authenticate, todoController.getProjectTodo);
module.exports = router;
