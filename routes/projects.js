let userController = require("../controller/user");
let notesController = require("../controller/notes");
let router = require('express').Router();

router.post('/:project_id/notes', userController.authenticate, notesController.addNotes);
router.get('/:project_id/notes', userController.authenticate, notesController.fetchNotes);
// router.post('/login', userController.loginUser);
// router.get('/info', userController.authenticate, userController.userInfo);
// router.get('/todo', userController.authenticate, todoController.fetchTodo);
// router.post('/todo', userController.authenticate, todoController.addTodo);
// router.put('/todo', userController.authenticate, todoController.updateTodo);

module.exports = router;
