var express = require('express');
var router = express.Router();
var debug = require('debug')('admin');
var admin = require("firebase-admin");
var _ = require('underscore')
var Promise = require('bluebird')
var models = require("../../models");

/**
 * @api {post} /dcms-admin/auth/login Login an Admin
 * @apiName Login
 * @apiGroup Admin
 *
 * @apiParam {String} idToken Id token from login.
 *
 * @apiSuccessExample {json} beforeRegister
{
  "name": "John Doe",
  "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
  "status": 10
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
                resolve(user)
            });
        return models.admin.create({
            uid: profile.user_id,
            name: profile.name,
            picture: profile.picture,
            email: profile.email
        });
    }).then(user => {
        res.json(_.pick(user, 'name', 'picture', 'status'))
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
