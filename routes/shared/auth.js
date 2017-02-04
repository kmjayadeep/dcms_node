var express = require('express');
var debug = require('debug')('auth');
var admin = require("firebase-admin");
var router = express.Router();
var models = require("../../models");

/*
Checks if body contains idToken
Checks validity of idToken
Finds uid of user and adds to req
 */
exports.firebaseAuth = function(req, res, next) {
    idToken = req.body.idToken;
    debug(idToken)
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            req.uid = decodedToken.uid;
            req.profile = decodedToken;
            next();
        }).catch(function(error) {
            res.status(500).send({
                code: 1,
                data: error,
                message: "Auth Error"
            })
            debug(error);
        });

}
