var router = require('express').Router();
var debug = require('debug')('public');
var models = require('../../models');
var constant = require('../../constant');
var _ = require('underscore');
/**
 * @api {get} /public/student/:uid get student detail
 * @apiDescription api to get the details of a particular student using his uid
 * @apiParam {uid} :uid firebase uid of student
 * @apiGroup Public/Student
 * @apiVersion 0.1.0
 * @apiSuccessExample found
 {
  "id": 2,
  "name": "John Doe",
  "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
  "phone": "426351789",
  "accomodation": "none",
  "status": "active",
  "score": 0,
  "registered": true,
  "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
  "normalisedScore": 0,
  "createdAt": "2017-02-09T18:42:42.000Z",
  "updatedAt": "2017-02-10T09:18:37.000Z",
  "collegeId": 21
}

 * @apiErrorExample not found
{"code":15,"message":"Could not find student"}
*/
router.get('/:uid', (req, res, next) => {
    models.student.findOne({
        where: {
            uid: req.params.uid
        }
    }).then(result => {
        if (!result)
            return new Promise((res, rej) => rej("invalid uid"));
        return res.json(result);
    }).catch(error => {
        constant.noStudentFound.data = error;
        return res.status(400).json(constant.noStudentFound);
    });
});

/**
 * @api {post} /public/student get student Details
 * @apiDescription get the details of student using either phone number or email or id
 * @apiParam {string} [phone] phone number
 * @apiParam {string} [id] student id
 * @apiParam {string} [email] Student email
 * @apiGroup Public/Student
 * @apiVersion 0.1.0
 * @apiSuccessExample found
 {
  "id": 2,
  "name": "John Doe",
  "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
  "phone": "426351789",
  "accomodation": "none",
  "status": "active",
  "score": 0,
  "registered": true,
  "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
  "normalisedScore": 0,
  "createdAt": "2017-02-09T18:42:42.000Z",
  "updatedAt": "2017-02-10T09:18:37.000Z",
  "collegeId": 21
}

 * @apiErrorExample not found
{"code":15,"message":"Could not find student"}
 * 
 */
router.post('/', (req, res, next) => {
    models.student.findOne({
        where: _.pick(req.body, 'uid', 'phone', 'email')

    }).then(result => {
        if (!result)
            return new Promise((res, rej) => rej("invalid uid"));
        return res.json(result);
    }).catch(error => {
        constant.noStudentFound.data = error;
        return res.status(400).json(constant.noStudentFound);
    });
});
module.exports = router;
