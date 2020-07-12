const {Router} = require("express")
const tweetController = require("../controllers/tweetController")
router = Router()

router.post("/create", tweetController.createTweet)

module.exports = router;
