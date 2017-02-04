var express = require('express');
var router = express.Router();
var debug = require('debug')('admin');
var admin = require("firebase-admin");
var _ = require('underscore')
var Promise = require('bluebird')
var models = require("../../models");
var token = require('../../middlewares/token');

router.get('/', function(req, res, next) {
    res.status(401).send('unauthorized access');
});




/**
 * @api {post} /user/login Login an Admin
 * @apiName Login
 * @apiGroup Admin
 *
 * @apiParam {String} idToken Id token from login.
 *
 * @apiSuccessExample {json} beforeRegister
 {
  "student": {
    "accomodation": "none",
    "status": "pending",
    "id": 1,
    "uid": "bJ1rrx0lpVSbUPs1WphU0BHfItD2",
    "updatedAt": "2017-02-04T09:21:52.000Z",
    "createdAt": "2017-02-04T09:21:52.000Z"
  },
  "created": true
}
 *
 * @apiErrorExample {json} error
{
    code: 1,
    data: error,
    message: "Auth Error"
}
 */
router.post('/login', function(req, res, next) {
    profile = req.profile;
    return models.admin.findOne({
        where: {
            uid: req.profile.user_id
        }
    }).then(user => {
        if (user)
            return new Promise((resolve, reject) => {
                if (user.status)
                    resolve(user)
                reject('user blocked')
            });
        return models.admin.create({
            uid: profile.user_id,
            name: profile.name,
            picture: profile.picture,
            email: profile.email
        });
    }).then(user => {
        res.json(_.pick(user, 'name', 'picture'))
    }).catch(function(error) {
        res.status(500).send({
            code: 2,
            data: error,
            message: "Could not create Admin"
        })
        debug(error);
    });
})

module.exports = router;
