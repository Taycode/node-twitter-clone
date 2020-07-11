const {Router} = require("express")

const router = Router()

const authController = require("../controllers/authController")

router.post('/user/create', authController.createUser)

module.exports = router
