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
 * @api {post} /dcms-admin/volunteer/registeredEvents get registered events
 * @apiDeprecated please use (#volunteer:GetDcmsAdminVolunteerRegisteredeventsIdentifier)
 * @apiParam {String} [uid] qr code scanned uid of student
 * @apiParam {String} [phone] Phone number of student
 * @apiParam {String} [email] email id of student
 * @apiDescription get all registered events of a student, the student is identified through either of email, phone number or uid(from qr scan)
 * @apiVersion 0.2.0
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
                        }],
                        attributes: ['id', 'name']
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
/**
 * @api {post} /dcms-admin/volunteer/addScore increase Score
 * @apiDescription increase the score for a particular student, can be from informals or events
 * @apiGroup volunteer
 * @apiVersion 0.1.0
 * @apiParam {string} :identifier either uid, email or phone number of student.
 * @apiParam {int} addScore how much the score should be increased
 * @apiParam {string} reason why the score was increased, make it mandatory (but will result in a lot of one letter reasons)
 * @apiSuccessExample success
 * "success"
 * @apiErrorExample error
    {"code":15,"message":"Could not find student"}
 * 
 * @apiUse tokenErrors
 */
router.post('/addScore/:identifier', (req, res, next) => {
    if (!req.body.reason)
        req.body.reason = "unspecified";
    if (!req.body.addScore)
        req.body.addScore = 0;
    var studentId = 0;
    models.student.findOne({
        where: {
            $or: [{
                email: req.params.identifier
            }, {
                phone: req.params.identifier
            }, {
                id: req.params.identifier
            }]
        }
    }).then(result => {
        if (!result)
            return new Promise((res, rej) => rej("invalid identifier"));
        studentId = result.toJSON().id;
        result.increment('score', { by: req.body.addScore });
    }).then(result => {
        return models.transaction.create({
            reason: req.body.reason,
            score: req.body.addScore,
            studentId: studentId,
            adminId: req.admin.id
        });
    }).then(result => {
        return res.json("success");
    }).catch(error => {
        debug(error);
        constant.noStudentFound.data = error;
        return res.status(400).json(constant.noStudentFound);
    });
});
/**
 * @api {post} /dcms-admin/volunteer/confirmPayment confirm payment
 * @apiDescription Confirm payment for a student for a particular event (if group event, the whole group payment will be confirmed)
 * @apiGroup volunteer
 * @apiVersion 0.1.0
 * @apiParam {string} :identifier either uid, email or phone number of student.
 * @apiParam {string} eventId id of the event to be confirmed
 * @apiParam {string} [paid=true] whether to set payment confirmed(true) or not confirmed(false)
 * @apiSuccessExample success
 * "success"
@apiErrorExample error
    {"code":15,"message":"Could not find student"}
 * 
 * @apiUse tokenErrors
 */
router.post('/confirmPayment/:identifier', (req, res, next) => {
    if (!req.body.paid)
        req.body.paid = true;
    var findStudent = models.student.findOne({
        where: {
            $or: [{
                email: req.params.identifier
            }, {
                phone: req.params.identifier
            }, {
                id: req.params.identifier
            }]
        }
    });
    var findEvent = models.event.findOne({
        where: {
            id: req.body.eventId
        }
    });
    Promise.all([findStudent, findEvent])
        .spread((student, event) => {
            if (!student)
                return new Promise((res, rej) => rej("invalid identifier"));
            if (!event)
                return new Promise((res, rej) => rej("invalid eventId"));
            if (event.group) {
                return models.groupStudent.findOne({
                    where: {
                        eventId: req.body.eventId,
                        studentId: student.id
                    }
                })
            } else {
                return models.eventStudent.findOne({
                    where: {
                        eventId: req.body.eventId,
                        studentId: student.id
                    }
                });
            }
        }).then(result => {
            debug(result.toJSON());
            //could either be eventStudent or groupStudent
            // if groupStudent, find event_student
            if (result.toJSON().eventStudentId)
                return models.eventStudent.findOne({
                    where: {
                        id: result.toJSON().eventStudentId
                    }
                });
            else
                return new Promise((res, rej) => res(result));
            //if eventStudent, return itself
        }).then(result => {
            return result.update({ 'paid': req.body.paid });
        }).then(result => {
            if (result)
                res.json("success");
            else
                return new Promise((res, rej) => rej("could not update"));
        }).catch(error => {
            debug("error", error);
            constant.noStudentFound.data = error;
            return res.status(400).json(constant.noStudentFound);
        });
});

function merge_object_arrays(arr1, arr2, match) {
    return _.union(
        _.map(arr1, function(obj1) {
            var same = _.find(arr2, function(obj2) {
                return obj1[match] === obj2[match];
            });
            return same ? _.extend(obj1, same) : obj1;
        }),
        _.reject(arr2, function(obj2) {
            return _.find(arr1, function(obj1) {
                return obj2[match] === obj1[match];
            });
        })
    );
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

/**
 * @api {get} /dcms-admin/volunteer/registeredEvents/:identifier (get) registered events
 * @apiParam {String} identifier either uid, phone or email of student
 * @apiDescription get all registered events of a student, the student is identified through either of email, phone number or uid(from qr scan). This is improved method than the one that uses post.
 * @apiVersion 0.1.0
 * @apiGroup volunteer
 * @apiSuccessExample {json} success
 * [
  {
    "id": 1,
    "paid": false,
    "registeredStudent": 100006,
    "name": "myEvent",
    "day": 1,
    "time": "10:57pm",
    "isWorkshop": false
  },
  {
    "id": 2,
    "paid": true,
    "registeredStudent": 100005,
    "name": "myEvent2",
    "day": 17,
    "time": "10:57pm",
    "isWorkshop": false
  }
]
 * @apiErrorExample {json} error
    {"code":5,"message":"Could not fetch events"} 
 * @apiUse tokenErrors
 */
router.get('/registeredEvents/:identifier', (req, res, next) => {
    try {

        models.student.findOne({
            where: {
                $or: [{
                    email: req.params.identifier
                }, {
                    phone: req.params.identifier
                }, {
                    id: req.params.identifier
                }]
            }
        }).then(student => {
            var getGroupStudent = models.groupStudent.findAll({
                where: {
                    studentId: student.id
                }
            }).then(groupStudents => {
                var eventStudentIds = groupStudents.map(x => {
                    return x.eventStudentId;
                });
                return models.eventStudent.findAll({
                    where: {
                        $or: [{
                            id: eventStudentIds
                        }],
                    },
                    attributes: ['eventId', 'paid', 'studentId']
                });
            });
            var getEventStudent = models.eventStudent.findAll({
                where: {
                    studentId: student.id
                },
                attributes: ['eventId', 'paid', 'studentId']
            });
            return Promise.all([getEventStudent, getGroupStudent])
                .spread((eventStudent, groupStudent) => {
                    eventStudent = eventStudent.concat(groupStudent);
                    eventIds = eventStudent.map(x => {
                        return x.eventId
                    });
                    newEventStudent = eventStudent.map(x => {
                        return {
                            id: x.eventId,
                            paid: x.paid,
                            registeredStudent: x.studentId
                        }
                    });
                    eventIds = Array.from(new Set(eventIds));
                    return models.event.findAll({
                        where: {
                            $or: [{
                                id: eventIds
                            }]
                        },
                        attributes: ['id', 'name', 'day', 'time', 'isWorkshop']
                    }).then(result => {
                        newEventList = result.map(x => {
                            return {
                                id: x.id,
                                name: x.name,
                                day: x.day,
                                time: x.time,
                                isWorkshop: x.isWorkshop
                            }
                        });
                        // res.json({ event: newEventStudent, list: newEventList });
                        newResult = merge_object_arrays(newEventStudent, newEventList, 'id', 'id');
                        return new Promise((res, rej) => {
                            newResult = Array.from(new Set(newResult));
                            newResult = removeDuplicates(newResult, 'id');
                            res(newResult);
                        })
                    });
                });
        }).then(result => {
            return res.json(result);
        }).catch(error => {
            debug(error)
            constant.cantfetchEvent.data = error;
            return res.status(400).json(constant.cantfetchEvent);
        });
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;