var debug = require('debug')('middle');
var admin = require("firebase-admin");

module.exports = function(req,res,next){
	console.log(req.url);
    idToken = req.body.idToken || req.headers['X-Auth-Token'];
    debug(idToken)
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            req.uid = decodedToken.uid;
            req.profile = decodedToken;
            next();
        }).catch(function(error) {
            res.status(401).send({
                code: 1,
                data: error,
                message: "Authentication Error"
            })
            debug(error);
        });
}