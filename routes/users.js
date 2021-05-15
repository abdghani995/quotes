let userController = require("../controller/user");
let router = require('express').Router();

router.post('', userController.addUser);
router.post('/login', userController.loginUser);
router.post('/info', userController.authenticate, userController.userInfo);

module.exports = router;
