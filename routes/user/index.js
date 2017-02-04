var express = require('express');
var debug = require('debug')('user');
var admin = require("firebase-admin");
var router = express.Router();
var models = require("../../models");
var Student = models.student;
router.get('/', function(req, res, next) {
    res.status(401).send('no route');
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
 * 			{
                code: 1,
                data: error,
                message: "Auth Error"
            }
 */
router.post('/login', function(req, res, next) {
    idToken = req.body.idToken;

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            var uid = decodedToken.uid;
            var student = Student.build(req.body);
            student.uid = uid;
            delete student.id;
            debug(student);
            Student.sync().then(function() {
                Student.findOrCreate({
                    where: {
                        uid: student.uid
                    }
                    /*,
                    defaults: {
                    	name: student.name
                    }*/

                }).spread(function(studentEntry, created) {
                    res.send({
                        student: studentEntry,
                        created: created
                    });
                });
            });
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
