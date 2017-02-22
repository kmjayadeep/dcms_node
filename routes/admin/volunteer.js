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
 * 	phone: 426351789
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

module.exports = router;
