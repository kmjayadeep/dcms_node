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
 * 
 */
router.post('/login', function(req, res, next) {
    idToken = req.body.idToken;

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            var uid = decodedToken.uid;
            var student = Student.build(req.body);
            student.uid = uid;
            debug(student);
            debug(uid);
            Student.sync().then(function() {
                Student.findOrCreate({
                    where: {
                        uid: student.uid
                    }
                }).then(function(result) {
                    var studentEntry = result[0], // the instance of the Student
                        created = result[1]; // boolean stating if it was created or not
                    if (created) {
                        // console.log('Student already exists');
                    }
		            res.send(studentEntry);
                });
            })
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
