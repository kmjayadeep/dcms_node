var express = require('express');
var router = express.Router();
var debug = require('debug')('admin');
var admin = require("firebase-admin");
var _ = require('underscore')
var Promise = require('bluebird')
var models = require("../../models");

router.get('/', function(req, res, next) {
    res.status(401).send('unauthorized access');
});




/**
 * @api {post} /user/login Login a User
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} idToken Id token from login.
 *
 * @apiSuccessExample {json} {
  "accomodation": "none",
  "status": "pending",
  "id": 4,
  "uid": "bJ1rrx0lpVSbUmBaWphU0BHfItD2",
  "updatedAt": "2017-02-03T18:31:02.000Z",
  "createdAt": "2017-02-03T18:31:02.000Z"
}
 *
 * @apiErrorExample {json} 
 *          {
                code: 1,
                data: error,
                message: "Auth Error"
            }
 */
router.post('/login', function(req, res, next) {
    idToken = req.body.idToken;
    var profile

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            // console.log(decodedToken)
            profile = decodedToken
            return models.admin.findOne({
                where: {
                    uid: decodedToken.user_id
                }
            })
        }).then(user => {
            if (user)
                return new Promise((resolve, reject) => {
                    if (user.status)
                        resolve(user)
                    reject('user blocked')
                })
            return models.admin.create({
                uid: profile.user_id,
                name: profile.name,
                picture: profile.picture,
                email: profile.email
            })
        }).then(user => {
            res.json(_.pick(user,'name','picture'))
        }).catch(function(error) {
            res.status(500).send({
                code: 1,
                data: error,
                message: "Auth Error"
            })
            debug(error);
        });
})

module.exports = router;
