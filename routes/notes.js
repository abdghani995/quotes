let userController = require("../controller/user");
let notesController = require("../controller/notes");
let router = require('express').Router();

router.get('/:note_id', userController.authenticate, notesController.fetchANote);
router.put('/:note_id', userController.authenticate, notesController.updateANote);

router.put('/:note_id/favourite', userController.authenticate, notesController.updateFavourite);
router.put('/:note_id/archieve', userController.authenticate, notesController.archieveANote);

module.exports = router;
