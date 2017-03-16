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
    idToken = req.body.idToken || req.headers['x-auth-token'] || "";
    if (req.url.startsWith('/student/updateGuntScore')) {
        debug(idToken);
        //random verification for gunt communication
        if (md5(idToken) == '1be9dbe0261a1dff35c3e50df7fe9e9a')
            return next();
    } else if (idToken && md5(idToken) == 'f8c27d1799617430cd525bda43c3fac2') {
        //random verification for test purposes
        req.uid = constant.testProfile.uid;
        req.profile = constant.testProfile;

        if (req.url.startsWith('/student/login')) {
            return next();
        }
        if (req.url.startsWith('/student')) {
            //TODO check if suspended
            models.student.findOne({
                where: {
                    uid: req.uid
                }
            }).then(result => {
                if (result.status != 'active')
                    throw (constant.studentSuspended);
                req.student = result;
                return next();
            }).catch(error => {
                throw (error)
            });
        } else if (req.url.startsWith('/dcms-admin/auth')) {
            return next();
        } else if (req.url.startsWith('/dcms-admin')) {
            models.admin.findOne({
                where: {
                    uid: req.profile.user_id
                }
            }).then(admin => {
                if (admin) {
                    req.admin = admin;
                    if (req.url.startsWith('/dcms-admin/volunteer')) {
                        // if (req.admin.status >= 5)
                            return next();
                    } else
                        return next();
                }
                throw {
                    msg: "Not Verified"
                }
            }).catch(error => {
                constant.wrongToken.data = error;
                return res.status(401).json(constant.wrongToken);
            });
        } else
            next();

    } else if (req.url.startsWith('/public')) {
        return next();
    } else if (!idToken) {
        return res.status(401).json(constant.noAuthToken);
    } else {
        admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                req.uid = decodedToken.uid;
                debug(req.uid);
                req.profile = decodedToken;
                debug(req.profile);
                if (req.url.startsWith('/student/login')) {
                    return next();
                }
                if (req.url.startsWith('/student')) {
                    //TODO check if suspended
                    models.student.findOne({
                        where: {
                            uid: req.uid
                        }
                    }).then(result => {
                        if (result.status != 'active')
                            throw (constant.studentSuspended);
                        req.student = result;
                        return next();
                    }).catch(error => {
                        throw (error)
                    });
                } else if (req.url.startsWith('/dcms-admin/auth')) {
                    return next();
                } else if (req.url.startsWith('/dcms-admin')) {
                    models.admin.findOne({
                        where: {
                            uid: req.profile.user_id
                        }
                    }).then(admin => {
                        if (admin && admin.status) {
                            req.admin = admin;
                            if (req.url.startsWith('/dcms-admin/volunteer')) {
                                if (req.admin.status >= 5)
                                    return next();
                            } else
                                return next();
                        }
                        throw {
                            msg: "Not Verified"
                        }
                    }).catch(error => {
                        return res.status(401).json(constant.wrongToken);
                    });
                } else
                    return next();
            }).catch((error) => {
                constant.wrongToken.data = error;
                return res.status(401).json(constant.wrongToken);
            });
    }
}