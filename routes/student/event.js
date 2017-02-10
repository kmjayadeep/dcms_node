var router = require('express').Router();
var debug = require('debug')('student');
var models = require("../../models");
var constant = require("../../constant");


/**
 * @api {put} /student/event/:id event Register
 * @apiDescription register a student in an event :id is event id, student id is found from idToken
 * @apiGroup Student
 * @apiVersion 0.1.0
 *
 * @apiParam {id} :id eventId
 * 
 * @apiParamExample {json} request
 * {}
 *
 * @apiSuccessExample {json} success
 * {
  "payment": 0,
  "paid": false,
  "eventId": "1",
  "studentId": 1,
  "updatedAt": "2017-02-09T18:27:12.000Z",
  "createdAt": "2017-02-09T18:27:12.000Z"
}
 *
 * @apiErrorExample no event found
{
    code: 14,
    message: "Could not find event to register"
}
 * @apiUse tokenErrors
*/
router.put('/:id', (req, res, next) => {
    models.student.findOne({
        where: {
            uid: req.uid
        }
    }).then(result => {
        return models.eventStudent.create({
            eventId: req.params.id,
            studentId: result.id
        });
    }).then(result => {
        return res.json(result);
    }).catch(error => {
        constant.noEventError.data = error;
        return res.status(400).json(constant.noEventError);
    })
});

/**
 * @api {get} /student/event/:id Check if event registered
 * @apiDescription from an event id and idToken it checks if a student is registered for a particular event
 * @apiGroup Student
 * @apiVersion 0.1.0
 *
 * @apiParam {id} :id eventId
 * 
 * @apiParamExample {json} request
 * {}
 *
 * @apiSuccessExample {json} success
 * {
  "payment": 0,
  "paid": false,
  "eventId": "1",
  "studentId": 1,
  "updatedAt": "2017-02-09T18:27:12.000Z",
  "createdAt": "2017-02-09T18:27:12.000Z"
}
 *
 * @apiErrorExample no event found
{
    code: 14,
    message: "Could not find event to register"
}
 * @apiUse tokenErrors
*/
router.get('/:id', (req, res, next) => {
    models.student.findOne({
        where: {
            uid: req.uid
        }
    }).then(result => {
        return models.eventStudent.findOne({
            where: {
                eventId: req.params.id,
                studentId: result.id
            }
        });
    }).then(result => {
        if (!result)
            result = {
                isRegistered: false
            };
        else
            result.dataValues.isRegistered = true
        return res.json(result);
    }).catch(error => {
        constant.noEventError.data = error;
        return res.status(400).json(constant.noEventError);
    })
});

module.exports = router;
