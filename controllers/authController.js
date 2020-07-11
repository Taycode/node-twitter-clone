const baseController = require("./baseController");
const admin = require("firebase-admin");
const db = admin.firestore();

class authController extends baseController{
    constructor() {
        super();
    }

    async createUser(req, res){

        try {
            let {username, displayName, email, password} = req.body;
            username = username || displayName
            let formData = {username, displayName, email, password}

            // Check if all data was submitted, if no data is blank
            if (super.checkIfAllDataFilled(formData).length){
                return super.sendError(res, undefined, super.checkIfAllDataFilled(formData), 400)
            }

            const createdFirebaseUser = await admin.auth().createUser({displayName, email, password});
            const userData = {
                username,
                email,
                displayName,
                created: new Date(),
                following: [],
                followers: [],
                bio: "",
                profilePicture: ""
            }

            await db.collection(`users`)
                .doc(createdFirebaseUser.uid)
                .set(userData)

            return super.sendSuccess(res, userData, "User Created", 201)
        }

        catch (err) {
            return super.sendError(res, err, err.message, 400)
        }

    }
}


module.exports = new authController();
