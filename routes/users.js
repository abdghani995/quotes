let router = require('express').Router();
let userController = require("../controller/user");
let todoController = require("../controller/todo");
let projectController = require("../controller/projects");

var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var admin = require('firebase-admin');

aws.config.update({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
})
var s3 = new aws.S3();

// var upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'upz-local',
//       metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//       },
//       key: function (req, file, cb) {
//         cb(null, new Date().toISOString()+file.originalname)
//       }
//     })
// })

const upload = multer({
    storage: multer.memoryStorage()
})

  


router.post('', userController.addUser);
router.post('/social', userController.userSocialOps);

router.post('/login', userController.loginUser);
router.get('/info', userController.authenticate, userController.userInfo);
router.post('/profileImage', userController.authenticate, upload.single('myFile'), userController.profileImage);

router.get('/todo', userController.authenticate, todoController.fetchTodo);
router.post('/todo', userController.authenticate, todoController.addTodo);
router.put('/todo', userController.authenticate, todoController.updateTodo);

router.post('/projects', userController.authenticate, projectController.addProject);
router.get('/projects', userController.authenticate, projectController.fetchProjects);

module.exports = router;
