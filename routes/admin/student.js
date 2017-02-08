var router = require('express').Router();
var debug = require('debug')('event')
var models = require('../../models');
var constant = require('../../constant.js');

/**
 * @api {get} /dcms-admin/student get student list
 * @apiGroup Admin/Student
 *
 *
 * @apiSuccessExample {json} success
[
  {
    "id": 2,
    "name": null,
    "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
    "phone": null,
    "accomodation": "none",
    "status": "pending",
    "score": 0,
    "normalisedScore": 0,
    "createdAt": "2017-02-07T09:52:54.000Z",
    "updatedAt": "2017-02-07T09:52:54.000Z",
    "collegeId": null
  }
]
 * @apiUse tokenErrors
 */
router.get('/', (req, res, next) => {
    models.student.findAll({}).then((result) => {
        res.json(result)
    }).catch(err => {
        constant.studentNotFound.error = err;
        res.status(400).json(constant.studentNotFound);
    });
});

/**
 * @api {get} /dcms-admin/student/:id get student details
 * @apiDescription get the student and his registered events, by specifying student id
 * @apiGroup Admin/Student
 *
 *
 * @apiSuccessExample {json} success
{
  "id": 2,
  "name": null,
  "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
  "phone": null,
  "accomodation": "none",
  "status": "pending",
  "score": 0,
  "normalisedScore": 0,
  "createdAt": "2017-02-07T09:52:54.000Z",
  "updatedAt": "2017-02-07T09:52:54.000Z",
  "events": [
    {
      "id": 1,
      "name": "kg",
      "description": "lkjh",
      "format": "jh",
      "problemStatement": "kjh",
      "prize1": 654,
      "prize2": 65,
      "prize3": 54,
      "group": false,
      "image": "lkj",
      "maxParticipants": 0,
      "maxGroups": 0,
      "createdAt": null,
      "updatedAt": null,
      "event_student": {
        "report": "2017-02-01T00:00:00.000Z",
        "createdAt": null,
        "updatedAt": null,
        "eventId": 1,
        "studentId": 2
      }
    }
  ],
  "college": "dfghj"
} 
* @apiUse tokenErrors
 */
router.get('/:id', (req, res, next) => {
    models.student.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: models.event
        }, {
            model: models.college
        }]
    }).then((result) => {
        result = result.toJSON();
        if (result.college)
            result.college = result.college.name;
        res.json(result)
    }).catch(err => {
        constant.studentNotFound.error = err;
        res.status(400).json(constant.studentNotFound);
    });
});

/**
 * @api {post} /dcms-admin/student/:id edit student
 * @apiName Edit Student
 * @apiGroup Admin/Student
 * 
 *
 * @apiParamExample sample request
{
    "name": "updated name"
}

 * @apiSuccessExample {json} edited
  success

 * @apiUse tokenErrors
 */

router.post('/:id', (req, res, next) => {
    models.student.update(
        req.body, {
            where: {
                id: req.params.id
            }
        }).then(result => {
        return res.json(result);
    }).catch(error => {
        res.json({
            code: 0,
            data: err
        })
    });
});

module.exports = router;
