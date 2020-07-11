const jwt = require('jsonwebtoken');
require("dotenv").config()
const admin = require("firebase-admin");


let jwtSecret = process.env.JWT_SECRET;

class BaseController {
    constructor(){
    }
    /**
     * send success
     * @param res
     * @param data
     * @param message
     * @param token
     * @param status
     * @param header
     */

    sendSuccess(res, data, message, status, header) {
        let resp = { status: true, };

        if (message)
            resp.message = message;

        if (data || data === [] || data === {})
            resp.data = data;

        status = status ? status : 200;
        resp.HttpStatus = status;

        if (header) return res.header(header, token).status(status).json(resp);

        return res.status(status).json(resp);
    }

    /**
     *  send error
     * @param res
     * @param message
     * @param error
     * @param status
     * @param HttpStatus
     */
    sendError(res, error, message, status, HttpStatus) {
        let resp = { status: false };
        resp.message = message ? message : 'An error has occurred, please try again';

        if (error)
            resp.error = error.stack;

        status = status ? status : 500;
        resp.HttpStatus = HttpStatus;

        return res.status(status).json(resp);
    }

    checkReqBody(res, req) {
        if (!req || !req.body) {
            this.sendError(res, null, 'Request body should not be empty', 400);
        }
    }

    cleanToBeSentData(objectInstance){
        if (!objectInstance){
            return null
        }
        Object.keys(objectInstance).forEach(key=>{

            // To Remove all data with values undefined
            if (objectInstance[key] === undefined){
                objectInstance[key] = ""
            }

            // to convert Firebase TimeStamp to Javascript TimeStamp
            if (objectInstance[key]._seconds){
                objectInstance[key] = objectInstance[key].toDate()
            }


        })

        return objectInstance
    }
    generateToken(userObject) {
        return jwt.sign(userObject, jwtSecret);
    }

    getUserClaim (token, fakeCompany){
        return admin.auth().verifyIdToken(token)
            .then((decodedToken)=>{
                if (fakeCompany){
                    decodedToken.company = fakeCompany
                }
                return decodedToken
            })
            .catch(
                (err)=>{
                    throw new Error(err)
                }
            )
    }

    getUserByUid (uid){
        return admin.auth().getUser(uid)
            .then((user)=>user)
            .catch((err)=> {
                throw new Error(err)
            })
    }

    checkIfAllDataFilled(data){
        let err = []
        Object.keys(data).forEach(key=>{
            if (!data[key]){
                err.push(`${key} is required`)
            }
        })

        return err
    }

    verifyToken(token) {
        return jwt.verify(token, jwtSecret);
    }

}





module.exports = BaseController;
