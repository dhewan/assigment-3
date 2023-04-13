var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const photoController = require('../controllers/photoController')
const auth = require('../middlewares/authentication')

router.post("/login", userController.login)
router.post("/register", userController.register)
router.get("/get-all-data",userController.getAllUsers)
router.get("/all-photo",auth,photoController.getAllPhoto)
router.get("/get-photo/:id",auth,photoController.getPhotoById)
router.post("/create-photo",auth,photoController.createPhoto)
router.put("/update-photo/:id",auth,photoController.updatePhoto)
router.delete("/delete-photo/:id",auth,photoController.deletePhoto)

module.exports = router;
