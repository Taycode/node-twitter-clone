const baseController = require("./baseController")
const admin = require("firebase-admin")
const db = admin.firestore()

class tweetController extends baseController {
  constructor() {
    super();
  }

  async createTweet (req, res){

    const {token} = req.headers;
    const {uid} = await super.getUserClaim(token)

    const tweetsRef = db.collection('tweets')
    let {tweet, parentTweet = ""} = req.body;
    let formData = {tweet}


    if (super.checkIfAllDataFilled(formData).length){
      return super.sendError(res, undefined, super.checkIfAllDataFilled(formData), 400)
    }

    let toBeSentData = {tweet, parentTweet, user: uid, time: new Date(), retweetCount: 0, likeCount: 0}

    await tweetsRef.add(toBeSentData)

    return super.sendSuccess(res, toBeSentData, "Tweet sent", 201)

  }
}

module.exports = new tweetController();
