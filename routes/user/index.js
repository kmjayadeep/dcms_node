var express = require('express');
var debug = require('debug')('user');
var admin = require("firebase-admin");
var router = express.Router();
var models = require("../../models");
var constant = require("../../constant");
var Student = models.student;
router.get('/', function(req, res, next) {
    res.status(401).send('no route');
});

/**
 * @api {post} /user/login Login a Student
 * @apiName Login
 * @apiGroup Student
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} idToken Id token from login.
 *
 * @apiSuccessExample {json} success
{
  "id": 4,
  "name": "John Doe",
  "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
  "phone": null,
  "accomodation": "none",
  "status": "active",
  "score": 0,
  "registered": false,
  "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
  "normalisedScore": 0,
  "createdAt": "2017-02-07T15:24:00.000Z",
  "updatedAt": "2017-02-07T15:24:00.000Z",
  "collegeId": null
}
 *
 * @apiErrorExample {json} authentication error
{
    code: 1,
    data: {},
    message: "Authentication Error"
}

 * @apiErrorExample {json} creation error
{
    code: 1,
    data: {},
    message: "Could not create user"
}

 */
router.post('/login', function(req, res, next) {
    debug(req.profile);
    debug(req.uid);

    var student = req.profile;
    student.uid = req.uid;
    student.name = req.profile.name;
    if (req.profile.picture)
        student.picture = req.profile.picture;
    delete student.id;
    Student.findOne({
        where: {
            uid: req.uid
        }
    }).then(result => {
        if (result)
            return new Promise((res, rej) => {
                res(result);
            })
        return Student.create(req.profile);
    }).then(student => {
        return res.json(student);
    }).catch(err => {
        constant.studentCreateError.data = err;
        return res.status(400)
            .json(constant.studentCreateError);
    })
});

/**
 * @api {post} /user/updateGuntScore update normalised score from gunt
 * @apiGroup GUNT
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} idToken token given to gunt.
 *
 * @apiSuccessExample {json} success
{
    code: 0,
    message: "Success"
}

 * @apiUse tokenErrors
 */
router.post('/updateGuntScore', (req, res, next) => {
    debug(req.body);
    Student.update({
        normalisedScore: req.body.normalisedScore
    }, {
        where: {
            uid: req.body.uid,
        }
    }).then(function(result) {
        res.json({
            code: 0,
            message: "Success"
        });
    }).catch(function(error) {
        res.status(400)
            .json({
                code: 1,
                message: "Could not update",
                data: error
            });
    });
});
module.exports = router;
