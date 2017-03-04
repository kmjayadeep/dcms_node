var router = require('express').Router();
var debug = require('debug')('admin')
var models = require('../../models');
var constant = require('../../constant');
var Promise = require('bluebird');
var _ = require('underscore');

/**
 * @api {get} /dcms-admin/volunteer/eventRegistered/:eventId eventRegistered?
 * @apiDescription see if a user is registered for a particular event, using either uid (QR) or phone number
 * @apiGroup volunteer
 *
 * @apiParam {:id} :eventId the id of the event
 * @apiParam {id} [uid] uid of the student, from qr code scanning
 * @apiParam {string} [phone] phone number of the student if qr code does not work
 *
 * @apiParamExample 
 * {
 *  phone: 426351789
 * }
 *
 * @apiSuccessExample {json} success
 * {
  "createdAt": "2017-02-13T07:24:32.000Z",
  "updatedAt": "2017-02-13T07:24:32.000Z",
  "eventStudentId": 264,
  "studentId": 100023,
  "eventId": 274,
  "isRegistered": true,
  "paid": false
    }
 * 
 * @apiSuccessExample {json} not registered
 * {
  "isRegistered": false,
    }

    
 * @apiErrorExample {json} wrong event or student
 * {
    }


 * 
 */
router.get('/eventRegistered/:id', (req, res, next) => {
    debug(_.pick(req.query, 'uid', 'phone', 'email'))
    var findStudent = models.student.findOne({
        where: _.pick(req.query, 'uid', 'phone', 'email')
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
        res.status(400).json(constant.exceptionThrown);
    }
});

/**
 * @api {get} /dcms-admin/volunteer/registeredEvents get registered events
 * @apiParam {String} [uid] qr code scanned uid of student
 * @apiParam {String} [phone] Phone number of student
 * @apiParam {String} [email] email id of student
 * @apiDescription get all registered events of a student, the student is identified through either of email, phone number or uid(from qr scan)
 * @apiVersion 0.1.0
 * @apiGroup volunteer
 * @apiSuccessExample {json} success
 * [
  {
    "id": 1,
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
    "location": null,
    "timeRequired": null,
    "contactName1": null,
    "contactPhone1": null,
    "contactEmail1": null,
    "contactName2": null,
    "contactPhone2": null,
    "contactEmail2": null,
    "createdAt": "2017-02-27T07:41:08.000Z",
    "updatedAt": "2017-02-27T07:41:08.000Z",
    "adminId": null
  }
]

 * @apiErrorExample {json} error
    {"code":5,"message":"Could not fetch events"} 
 * @apiUse tokenErrors
 */
router.post('/registeredEvents', (req, res, next) => {
    models.student.findOne({
        where: _.pick(req.body, 'uid', 'phone', 'email')
    }).then(student => {
        var getGroupStudent = models.groupStudent.findAll({
            where: {
                studentId: student.id
            }
        });
        var getEventStudent = models.eventStudent.findAll({
            where: {
                studentId: student.id
            }
        });
        return Promise.all([getEventStudent, getGroupStudent])
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
            });
    }).then(result => {
        res.json(result);
    }).catch(error => {
        debug(error)
        constant.cantfetchEvent.data = error;
        res.status(400).json(constant.cantfetchEvent);
    });
});
module.exports = router;
