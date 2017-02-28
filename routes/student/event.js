var router = require('express').Router();
var debug = require('debug')('student');
var models = require("../../models");
var constant = require("../../constant");
var Promise = require('bluebird');

/**
 * @api {put} /student/event/:id Event Register
 * @apiDescription register a student in an event :id is event id, student id is found from idToken, It can also register a group, if it is a group event, add the param group in req.body as an array of student id's
 * @apiGroup Student
 * @apiVersion 0.2.0
 *
 * @apiParam {id} :id eventId
 * @apiParam {array} group array of studentIds
 * 
 * @apiParamExample {json} single event request
 * {}
 *
 * @apiParamExample {json} group event request
 * {
 *     group: [1,2,3,4]
 * }
 *
 *
 * @apiErrorExample no event found
{
    code: 14,
    message: "Could not find event to register"
}

@apiSuccessExample sucess
"success"

 * @apiUse tokenErrors
*/
router.put('/:id', (req, res, next) => {
    var event = {}
    var student = {}
    var findStudent = models.student.findOne({
        where: {
            uid: req.uid
        }
    });
    var findEvent = findStudent.then(student => {
        return models.event.findOne({
            where: {
                id: req.params.id
            }
        })
    });
    var eventStudent = findStudent.then(student => {
        return models.eventStudent.create({
            eventId: req.params.id,
            studentId: student.id
        })
    });
    eventStudentSave = "";
    try {
        Promise.all([findStudent, findEvent, eventStudent])
            .spread((student, event, eventStudent) => {
                eventStudentSave = eventStudent;
                if (event.group) {
                    if (!req.body.group) {
                        return new Promise((res, rej) => rej({
                            msg: "No group tag found"
                        }))
                    }
                    req.body.group.push(student.id);
                    req.body.group = Array.from(new Set(req.body.group));
                    return models.groupStudent.bulkCreate(
                        req.body.group.map(x => {
                            return {
                                eventStudentId: eventStudent.id,
                                studentId: x,
                                eventId: event.id
                            }
                        })
                    );
                } else {
                    return new Promise((res, rej) => res());
                }
            }).then(result => {
                return res.json("success");
            }).catch(error => {
                debug(error)
                models.eventStudent.destroy({
                    where: {
                        id: eventStudentSave.id
                    }
                });
                constant.noEventError.data = error;
                return res.status(400).json(constant.noEventError);
            });
    } catch (error) {
        debug(error);
    }
});

/**
 * @api {get} /student/event/:id Check if event registered
 * @apiDescription from an event id and idToken it checks if a student is registered for a particular event
 * @apiGroup Student
 * @apiVersion 0.2.0
 *
 * @apiParam {id} :id eventId
 * 
 * @apiParamExample {json} request
 * {}
 *
 * @apiSuccessExample {json} individual
 {
   "id": 4,
   "report": null,
   "paid": false,
   "createdAt": "2017-02-12T08:22:41.000Z",
   "updatedAt": "2017-02-12T08:22:41.000Z",
   "eventId": 4,
   "studentId": 2,
   "isRegistered": true
 }
 
 * @apiSuccessExample {json} group
 {
   "createdAt": "2017-02-12T08:25:12.000Z",
   "updatedAt": "2017-02-12T08:25:12.000Z",
   "eventStudentId": 8,
   "studentId": 2,
   "eventId": 5,
   "isRegistered": true,
   "paid": false
 }
* @apiSuccessExample {json} not registered
* {
*     "isRegistered": false
* }
* 
 @apiSuccessExample {json} no Event Found
 {}

 * @apiUse tokenErrors
*/
router.get('/:id', (req, res, next) => {
    var findStudent = models.student.findOne({
        where: {
            uid: req.uid
        }
    });
    var findEvent = models.event.findOne({
        where: {
            id: req.params.id
        }
    });
    try {
        Promise.all([findStudent, findEvent])
            .spread((student, event) => {
                if (event.group) {
                    return models.groupStudent.findOne({
                        where: {
                            studentId: student.id,
                            eventId: event.id
                        },
                        include: [{
                            model: models.eventStudent
                        }]
                    });
                } else {
                    return models.eventStudent.findOne({
                        where: {
                            eventId: event.id,
                            studentId: student.id
                        }
                    });
                }
            }).then((result) => {
                debug("result", result);
                if (result) {
                    result.dataValues.isRegistered = true;
                    if (result.dataValues.event_student) {
                        result.dataValues.paid = result.dataValues.event_student.paid;
                        delete result.dataValues.event_student;
                    }
                } else
                    result = {
                        isRegistered: false
                    }
                return res.json(result)
            }).catch(error => {
                return res.json(error);
                constant.noEventError.data = error;
                return res.status(400).json(constant.noEventError);
            });
    } catch (error) {
        debug(error);
    }
});

/**
 * @api {get} /student/event get registered events
 * @apiDescription find all the events that the logged in student has registered for
 * @apiGroup Student
 * @apiUse tokenErrors
 *
 * @apiErrorExample {json} error
 * {"code":5,"message":"Could not fetch events"}
 * 
 * @apiSuccessExample {json} success
 * [
  {
    "id": 123,
    "name": "sdf",
    "description": "asdf",
    "format": "asdf",
    "prize1": 1234,
    "prize2": 13,
    "prize3": 123,
    "group": false,
    "image": "",
    "maxPerGroup": 0,
    "category": "AR",
    "regFee": 34,
    "status": 1,
    "day": 1,
    "time": "10:20",
    "isWorkshop": true,
    "contactName1": "asdf",
    "contactPhone1": "654321987",
    "contactEmail1": "asdf@asdf.com",
    "contactName2": "asdf",
    "contactPhone2": null,
    "contactEmail2": null,
    "createdAt": null,
    "updatedAt": "2017-02-18T06:43:17.000Z",
    "adminId": null
  },
  {
    "id": 126,
    "name": "myEvent",
    "description": "my event",
    "format": "this event format",
    "prize1": 1000,
    "prize2": 500,
    "prize3": 300,
    "group": true,
    "image": "someurl",
    "maxPerGroup": 0,
    "category": "CS",
    "regFee": 0,
    "status": 1,
    "day": null,
    "time": null,
    "isWorkshop": false,
    "contactName1": null,
    "contactPhone1": null,
    "contactEmail1": null,
    "contactName2": null,
    "contactPhone2": null,
    "contactEmail2": null,
    "createdAt": "2017-02-20T04:26:13.000Z",
    "updatedAt": "2017-02-20T04:26:13.000Z",
    "adminId": null
  }
]
 */
router.get('/', (req, res, next) => {
    var getGroupStudent = models.groupStudent.findAll({
        where: {
            studentId: req.student.id
        }
    });
    var getEventStudent = models.eventStudent.findAll({
        where: {
            studentId: req.student.id
        }
    });
    try {
        Promise.all([getEventStudent, getGroupStudent])
            .spread((eventStudent, groupStudent) => {
                eventIds = eventStudent.map(x => {
                    return x.eventId;
                });
                eventIds = eventIds.concat(groupStudent.map(x => {
                    return x.eventId;
                }));
                eventIds = Array.from(new Set(eventIds));
                return models.event.findAll({
                    where: {
                        $or: [{
                            id: eventIds
                        }]
                    }
                });
            }).then(result => {
                res.json(result);
            }).catch(error => {
                debug(error)
                constant.cantfetchEvent.data = error;
                res.status(400).json(constant.cantfetchEvent);
            });
    } catch (error) {
        debug(error);
    }
});
module.exports = router;
