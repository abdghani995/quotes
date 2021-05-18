let userController = require("../controller/user");
let notesController = require("../controller/notes");
let projectsController = require("../controller/projects");
let router = require('express').Router();

router.get('/:project_id/info', userController.authenticate, projectsController.fetchProjectData);
router.post('/:project_id/notes', userController.authenticate, notesController.addNotes);
router.get('/:project_id/notes', userController.authenticate, notesController.fetchNotes);
router.put('/:project_id/favourite', userController.authenticate, projectsController.toggleProjectFavourite);
module.exports = router;
