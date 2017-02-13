var express = require('express');
var debug = require('debug')('student');
var router = express.Router();
var models = require("../../models");
var constant = require("../../constant");
var Student = models.student;
var _ = require('underscore');
router.get('/', function(req, res, next) {
    res.status(401).send('no route');
});

router.use('/event/', require('./event.js'));

/**
 * @api {post} /student/login Login a Student
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

 * @apiErrorExample {json} creation error
{"code":3,
"message":"Could not create user"}

 * @apiErrorExample {json} authentication error
{
    code: 1,
    data: {},
    message: "Authentication Error"
}
 */
router.post('/login', function(req, res, next) {
    debug(req.profile);
    debug(req.uid);

    var student = req.profile;
    student.uid = req.uid;
    student.name = req.profile.name;
    student.email = req.profile.email;
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
 * @api {post} /student/register Register Student
 * @apiDescription Register student by adding phone number, collegeId and accomodation request
 * @apiGroup Student
 * @apiParam {String} phone Phone Number
 * @apiParam {Enum=['none','male','female']} accomodation=none Whether accomodation is needed
 * @apiParam {id} collegeId college Id of the related college
 *
 * @apiExample request
 *{
      "phone":456987132,
      "collegeId":2
  }
 *
 * @apiSuccessExample success
 * "registered"
 * 
 * @apiErrorExample error
 * {
      "code": 13,
      "message": "Could not register student"
    }
 * @apiUse tokenErrors
 *  
 */
router.post('/register', (req, res, next) => {
    req.body.registered = true;
    Student.update(_.pick(req.body, 'phone', 'accomodation', 'collegeId', 'registered'), {
        where: {
            uid: req.uid
        }
    }).then(result => {
        res.json("Registered");
    }).catch(error => {
        res.status(400).json(constant.registerFailed);
    });
});

/**
 * @api {post} /student/updateGuntScore update normalised score from gunt
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
