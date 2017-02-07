var debug = require('debug')('middle');
var admin = require("firebase-admin");
var models = require('../models');
var constant = require('../constant');
var md5 = require('md5');
var constant = require('../constant.js');

/**
 *
 * 
 */
module.exports = function(req, res, next) {
    idToken = req.body.idToken || req.headers['x-auth-token'];
    if (!idToken)
        return res.status(401).json(constant.noAuthToken);
    else if (req.url.startsWith('/user/updateGuntScore')) {
        debug(idToken);
        //random verification for gunt communication
        if (md5(idToken) == '1be9dbe0261a1dff35c3e50df7fe9e9a')
            return next();
    } else if (md5(idToken) == 'f8c27d1799617430cd525bda43c3fac2') {
        //random verification for test purposes
        req.uid = constant.testProfile.uid;
        req.profile = constant.testProfile;
        models.admin.findOne({
            where: {
                uid: req.uid
            }
        }).then(admin => {
            debug(admin);
            if (admin)
                req.admin = admin;
            return next();
        }).catch(error => {
            res.status(400).json(constant.adminNotFound);
        });
    } else {
        admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                req.uid = decodedToken.uid;
                debug(req.uid);
                req.profile = decodedToken;
                debug(req.profile);
                if (req.url.startsWith('/user')) {
                    //TODO check if suspended
                    next();
                } else if (req.url.startsWith('/dcms-admin/auth')) {
                    next();
                } else if (req.url.startsWith('/dcms-admin')) {
                    models.admin.findOne({
                        where: {
                            uid: req.profile.user_id
                        }
                    }).then(admin => {
                        if (admin && admin.status) {
                            req.admin = admin;
                            return next();
                        }
                        throw {
                            msg: "Not Verified"
                        }
                    }).catch(error => {
                        res.status(401).json(constant.wrongToken);
                    });
                } else
                    next();
            }).catch((error) => {
                res.status(401).json(constant.wrongToken);
            });
    }
}
