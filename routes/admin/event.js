var router = require('express').Router();
var debug = require('debug')('admin')
var models = require('../../models');
var constant = require('../../constant');
var fcm = require('../fcm');
var Promise = require('bluebird');
var _ = require('underscore');
/**
 * @apiDefine tokenErrors
 * @apiHeader {String} x-auth-token idToken from Login
 * 
 *  * @apiErrorExample {json} invalid user error
{
  "code": 1,
  "data": {
    "msg": "Not Verified"
  },
  "message": "Authentication Error"
}

 * @apiErrorExample {json} no token error
{
  "code": 1,
  "data": {
    "msg": "No authentication token"
  },
  "message": "Authentication Error"
}

 * 
 */
/**
 * @api {put} /dcms-admin/event/ add event
 * @apiName Put Event
 * @apiGroup Admin/Event
 *
 *
 * @apiParam {Integer} id column Id
 * @apiParam {String} name Name of event
 * @apiParam {String} description Description of Event
 * @apiParam {Text} format Event Format
 * @apiParam {Text} problemStatement problem statement
 * @apiParam {Integer} prize1 first Prize
 * @apiParam {Integer} prize2 second Prize
 * @apiParam {Integer} prize3 third Prize
 * @apiParam {Bool} group=false Whether or not it is a group event
 * @apiParam {String} image Event Image Url
 * @apiParam {Integer} maxParticipants=0 max no of participants (0-unlimited)
 * @apiParam {Integer} maxGroups=0 max no of groups (0-unlimited)

 * @apiParamExample sample request
 * {
 *   "name": "myEvent",
 *   "description": "my event",
 *   "format": "this event format",
 *   "problemStatement": "problems is this",
 *   "prize1": "1000",
 *   "prize2": "500",
 *   "prize3": "300",
 *   "group": "true",
 *   "image": "someurl"
 * }

 * @apiSuccessExample {json} success
{
  "maxParticipants": 0,
  "maxGroups": 0,
  "id": 1,
  "name": "myEvent",
  "description": "my event",
  "format": "this event format",
  "problemStatement": "problems is this",
  "prize1": "1000",
  "prize2": "500",
  "prize3": "300",
  "group": true,
  "image": "someurl",
  "updatedAt": "2017-02-04T11:03:57.000Z",
  "createdAt": "2017-02-04T11:03:57.000Z"
}

 * @apiUse tokenErrors

 */
router.put('/', function(req, res, next) {
    var event = models.event.create(req.body)
        .then(event => {
            fcm.updateSync();
            if (event)
                return res.json(event)
        }).catch(error => {
            constant.cantCreateEvent.data = error;
            return res.status(400)
                .json(constant.cantCreateEvent);
        })
});

/**
 * @api {post} /dcms-admin/event/result/:id Update result
 * @apiDescription Add results of an event, the people who won the event and their respective points. Does not increase score of individual
 * @apiParam {Integer} :id id of the event
 * @apiParam {string} identifier identifier of student, either email, or phone or id
 * @apiParam {Integer} position position of student, 1,2 or 3
 * @apiParam {Integer} points points the student has won
 * @apiGroup Admin/Event
 * @apiVersion 0.2.0
 * 
 * @apiSuccessExample success
 * "success"
 * 
 * @apiErrorExample error
 * {"code":11,"message":"Student could not be found"}
 * @apiUse tokenErrors
 */
router.post('/result/:id', (req, res, next) => {
    models.student.findOne({
        where: {
            $or: [{
                email: req.body.identifier
            }, {
                phone: req.body.identifier
            }, {
                id: req.body.identifier
            }]
        }
    }).then(student => {
        return models.result.create({
            position: req.body.position,
            points: req.body.points,
            eventId: req.params.id,
            collegeId: student.collegeId,
            studentId: student.id
        });
    }).then(result => {
        res.json("success");
    }).catch(error => {
        res.status(400).json(constant.studentNotFound);
    })
});
/**
 * @api {get} /dcms-admin/event/ get event list
 * @apiName Get Events
 * @apiGroup Admin/Event
 *
 *
 * @apiParam {Integer} [id] Column Id
 * @apiParam {String} [name] Name of event
 * @apiParam {String} [description] Description of Event
 * @apiParam {Text} [format] Event Format
 * @apiParam {Text} [problemStatement] problem statement
 * @apiParam {Integer} [prize1] first Prize
 * @apiParam {Integer} [prize2] second Prize
 * @apiParam {Integer} [prize3] third Prize
 * @apiParam {Bool} [group] Whether or not it is a group event
 * @apiParam {String} [image] Event Image Url
 * @apiParam {Integer} [maxParticipants] max no of participants (0-unlimited)
 * @apiParam {Integer} [maxGroups] max no of groups (0-unlimited)

 * @apiParamExample sample request
 * {
 *   "name": "myEvent",
 * }

 * @apiSuccessExample {json} success
[
  {
    "id": 1,
    "name": "myEvent",
    "description": "my event",
    "format": "this event format",
    "problemStatement": "problems is this",
    "prize1": 1000,
    "prize2": 500,
    "prize3": 300,
    "group": true,
    "image": "someurl",
    "maxParticipants": 0,
    "maxGroups": 0,
    "createdAt": "2017-02-04T11:03:57.000Z",
    "updatedAt": "2017-02-04T11:03:57.000Z"
  }
]
 * @apiUse tokenErrors
 */
router.get('/', (req, res, next) => {
    models.event.findAll({
        where: {
            isWorkshop: false
        }
    }).then((list) => {
        res.json(list);
    }).catch(error => {
        constant.cantfetchEvent.data = error;
        res.status(400)
            .json(constant.cantfetchEvent)
    })
});

/**
 * @api {delete} /dcms-admin/event/:id delete events
 * @apiName Delete Events
 * @apiGroup Admin/Event
 * 
 * @apiSuccessExample {json} deleted
{
  "deleted": true,
  "message": "success"
}

 * @apiErrorExample {json} could not delete
{
  "deleted": false,
  "message": "success"
}

@apiErrorExample {json} delete non existent event
{
  "code": 5,
  "data": {},
  "message": "Could not delete events"
}

 * @apiUse tokenErrors
 * 
 */
router.delete('/:id', (req, res, next) => {
    models.event.destroy({
        where: {
            id: req.params.id
        }
    }).then(boolean => {
        fcm.updateSync();
        res.json({
            deleted: boolean == 1,
            message: "success"
        });
    }).catch(error => {
        constant.cantDeleteEvent.data = error;
        res.status(400).json(constant.cantDeleteEvent);
    })
});

/**
 * @api {post} /dcms-admin/event/:id edit events
 * @apiName Edit Events
 * @apiGroup Admin/Event
 * 
 *
 * @apiParamExample sample request
{
    "description": "updated description"
}

 * @apiSuccessExample {json} edited
  success

 * @apiUse tokenErrors
 */

router.post('/:id', (req, res, next) => {
    models.event.update(
        req.body, {
            where: {
                id: req.params.id
            }
        }).then(result => {
        fcm.updateSync();
        debug("not array", result);
        return res.json(result);
    }).catch(error => {
        constant.cantEditEvent.data = error;
        return res.status(400).json(constant.cantEditEvent);
    });
});
/**
 * @api {get} /dcms-admin/event/student/:id registerd students
 * @apiDescription Get all the students for a particular event by giving the event id
 * @apiGroup Admin/Event
 * @apiVersion 0.1.0
 * @apiDeprecated please use (#Admin_Event:GetDcmsAdminEventRegisteredcountEventid)
 * @apiParam {string} :id id of the event
 * @apiSuccessExample success
[
  {
    "name": "myEvent",
    "students": [
      {
        "name": "John Doe",
        "email": "johndoe@gmail.com",
        "phone": "426351789",
        "college": {
          "name": "mycollege"
        },
        "event_student": {
          "id": 15,
          "report": null,
          "paid": false,
          "createdAt": "2017-03-09T14:32:37.000Z",
          "updatedAt": "2017-03-09T14:32:37.000Z",
          "eventId": 1,
          "studentId": 100006
        }
      }
    ],
    "group_students": [
      {
        "eventStudentId": 15,
        "student": {
          "name": "blah",
          "email": "blah",
          "phone": "blah",
          "college": {
              "name" : "blah"
          }
        }
      },
      {
        "eventStudentId": 15,
        "student": {
          "name": "John Doe",
          "email": "johndoe@gmail.com",
          "phone": "426351789",
          "college": {
            "name": "mycollege"
          }
        }
      }
    ]
  }
]
 * @apiErrorExample error
{"code":14,"message":"Could not find event to register"}
 * @apiUse tokenErrors
 */
router.get('/student/:id', (req, res, next) => {
    try {
        models.event.findAll({
            where: {
                id: req.params.id
            },
            attributes: ['name'],
            include: [{
                model: models.student,
                attributes: ['name', 'email', 'phone'],
                include: [{
                    model: models.college,
                    attributes: ['name']
                }]
            }, {
                model: models.groupStudent,
                attributes: ['eventStudentId'],
                include: [{
                    model: models.student,
                    attributes: ['name', 'email', 'phone'],
                    include: [{
                        model: models.college,
                        attributes: ['name']
                    }],
                }]
            }]
        }).then(studentList => {
            return res.json(studentList);
            console.log(error);
        }).catch(error => {
            constant.noEventError.data = error;
            return res.status(400).json(constant.noEventError);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

/**
 * @api {get} /dcms-admin/event/registeredCount registeredCount
 * @apiDescription get no of students registered for every event
 * @apiGroup Admin/Event
 * @apiVersion 0.1.0
 * 
 * 
 * @apiSuccessExample success
[
  {
    "id": 1,
    "name": "myEvent",
    "image": "someurl",
    "category": "CS",
    "day": null,
    "time": null,
    "group": true,
    "students": 1,
    "groupStudents": 2
  },
  {
    "id": 2,
    "name": "myEvent",
    "image": "someurl",
    "category": "CS",
    "day": null,
    "time": null,
    "group": false,
    "students": 1,
    "groupStudents": 0
  }
]
 * @apiErrorExample error
    {"code":14,"message":"Could not find event to register"}
 * 
 * @apiUse tokenErrors
 */
router.get('/registeredCount', (req, res, next) => {
    try {
        models.event.findAll({
            where: {},
            include: [{
                model: models.student,
                attributes: ['id'],
            }, {
                model: models.groupStudent,
                attributes: ['eventStudentId'],
                group: ['eventStudentId'],
                include: [{
                    model: models.student,
                    attributes: ['id'],
                }]
            }]
        }).then(studentList => {
            studentList = studentList.map(x => {
                object = {};
                object.id = x.id;
                object.name = x.name;
                object.image = x.image;
                object.category = x.category;
                object.day = x.day;
                object.time = x.time;
                object.prize1 = x.prize1;
                object.prize2 = x.prize2;
                object.prize3 = x.prize3;
                object.group = x.group;
                object.students = x.students.length;
                object.groupStudents = x.group_students.length;
                return object;
            })
            return res.json(studentList);
            console.log(error);
        }).catch(error => {
            constant.noEventError.data = error;
            return res.status(400).json(constant.noEventError);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

/**
 * @api {get} /dcms-admin/event/registeredCount/:eventId registeredCount details
 * @apiDescription get students registered for single event
 * @apiGroup Admin/Event
 * @apiVersion 0.2.0
 * @apiSuccessExample groupEvent
{
	"name": "myEvent",
	"group": true,
	"students": [
		{
			"id": 100005,
			"name": "random name",
			"email": "coolemail@email.com",
			"phone": "65498731",
			"college": "bmycollege",
			"paid": true,
			"group": [
				{
					"id": 100005,
					"name": "random name",
					"email": "coolemail@email.com",
					"phone": "65498731",
					"college": "bmycollege"
				},
				{
					"id": 100006,
					"name": "John Doe",
					"email": "johndoe@gmail.com",
					"phone": "426351789",
					"college": "mycollege"
				}
			]
		}
	],
	"studentCount": 1,
	"totalCount": 2
}

 * @apiSuccessExample singleEvent
{
	"name": "myEvent",
	"group": false,
	"students": [
		{
			"id": 100006,
			"name": "John Doe",
			"email": "johndoe@gmail.com",
			"phone": "426351789",
			"college": "mycollege",
			"paid": false,
			"group": []
		}
	],
	"studentCount": 1
}
 * @apiErrorExample error
    {"code":14,"message":"Could not find event to register"}
 * 
 * @apiUse tokenErrors
 */
router.get('/registeredCount/:eventId', (req, res, next) => {
    try {
        models.event.findOne({
            where: {
                id: req.params.eventId
            },
            attributes: ['name', 'group'],
            include: [{
                model: models.student,
                attributes: ['id', 'name', 'email', 'phone'],
                include: [{
                    model: models.college,
                    attributes: ['name']
                }]
            }, {
                model: models.groupStudent,
                attributes: ['eventStudentId'],
                include: [{
                    model: models.student,
                    attributes: ['id', 'name', 'email', 'phone'],
                    include: [{
                        model: models.college,
                        attributes: ['name']
                    }],
                }]
            }]
        }).then(studentList => {
            object = JSON.parse(JSON.stringify(studentList));
            object.students = studentList.students.map(x => {
                var eventStudentId = 0;
                studentObject = {};
                studentObject.id = x.id;
                studentObject.name = x.name;
                studentObject.email = x.email;
                studentObject.phone = x.phone;
                if (x.college && x.college.name)
                    studentObject.college = x.college.name;
                else
                    studentObject.college = "other";
                if (x.event_student) {
                    studentObject.paid = x.event_student.paid;
                    eventStudentId = x.event_student.id;
                }
                studentObject.group = _.filter(studentList.group_students, x => {
                    return x.eventStudentId == eventStudentId;
                });
                studentObject.group = studentObject.group.map(x => {
                    studentGroupObject = {};
                    studentGroupObject.id = x.student.id;
                    studentGroupObject.name = x.student.name;
                    studentGroupObject.email = x.student.email;
                    studentGroupObject.phone = x.student.phone;
                    if (x.student.college && x.student.college.name)
                        studentGroupObject.college = x.student.college.name;
                    else
                        studentGroupObject.college = "other";
                    return studentGroupObject;
                });
                return studentObject;
            });
            object.studentCount = object.students.length;
            if (object.group_students.length > 0)
                object.totalCount = object.group_students.length;
            delete(object.group_students);
            return res.json(object);
            console.log(error);
        }).catch(error => {
            constant.noEventError.data = error;
            return res.status(400).json(constant.noEventError);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
/**
 * @api {get} /dcms-admin/event/:id get event
 * @apiName Get Event
 * @apiGroup Admin/Event
 *
 *
 * @apiSuccessExample {json} success
{
  "id": 1000000006,
  "name": "Event Name changed",
  "description": "Event description changed",
  "format": "Event format",
  "problemStatement": "Event problem Statement",
  "prize1": 1,
  "prize2": 2,
  "prize3": 3,
  "group": false,
  "image": null,
  "maxParticipants": 0,
  "maxGroups": 0,
  "createdAt": "2017-02-07T15:49:05.000Z",
  "updatedAt": "2017-02-07T15:49:06.000Z",
  "admins": [],
  "allAdmins": [
    {
      "id": 1,
      "name": "nisham mohammed",
      "uid": "bJ1rrx0lpVSbUPs1WphU0BHfItD2",
      "email": "mnishamk1995@gmail.com",
      "phone": null,
      "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
      "status": 0,
      "eventMail": null,
      "createdAt": "2017-02-07T15:03:46.000Z",
      "updatedAt": "2017-02-07T15:03:46.000Z"
    },
    {
      "id": 2,
      "name": "John Doe",
      "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
      "email": "johndoe@gmail.com",
      "phone": null,
      "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
      "status": 10,
      "eventMail": null,
      "createdAt": "2017-02-07T15:28:51.000Z",
      "updatedAt": "2017-02-07T15:53:11.000Z"
    }
  ]
}
 * @apiUse tokenErrors
 */
router.get('/:id', (req, res, next) => {
    let event = null
    models.event.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: models.admin
        }]
    }).then((ev) => {
        event = ev.toJSON()
        res.json(event)
    }).catch(error => {
        constant.cantfetchEvent.data = error;
        res.status(400)
            .json(constant.cantfetchEvent)
    })
});
module.exports = router;