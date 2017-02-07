var router = require('express').Router();
var debug = require('debug')('admin')
var models = require('../../models');
var constant = require('../../constant');

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
            if (event)
                return res.json(event)
        }).catch(error => {
            constant.cantCreateEvent.data = error;
            res.status(400)
                .json(constant.cantCreateEvent);
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
    debug(req.query)
    models.event.findAll({
        where: req.query
    }).then((list) => {
        res.json(list);
    }).catch(error => {
        constant.cantfetchEvent.data = error;
        res.status(400)
            .json(constant.cantfetchEvent)
    })
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
        return models.admin.findAll()
    }).then(admins => {
        let adminIds = event.admins.map(admin => admin.id)
        event.allAdmins = admins.filter(admin => {
            return !adminIds.includes(admin.id)
        })
        res.json(event)
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
        debug("not array", result);
        return res.json(result);
    }).catch(error => {
        constant.cantEditEvent.data = error;
        return res.status(400).json(constant.cantEditEvent);
    });
});

/**
 * @api {put} /dcms-admin/event/admin Add admin to events
 * @apiName adminAdd
 * @apiGroup Admin/Event
 * 
 *
 * @apiParamExample sample request
{
  "eventId" : 1,
  "adminIds" : [1]
}

 * @apiSuccessExample {json} edited
  success

 * @apiUse tokenErrors
 */
router.put('/admin/:eventId', (req, res, next) => {
    console.log(req.body)
    var eventAdminArray = req.body.adminIds.map(adminId => {
        return {
            eventId: req.params.eventId,
            adminId: adminId
        }
    });
    debug(eventAdminArray)
    models.eventAdmin.destroy({
        where: {
            eventId: req.params.eventId
        }
    }).then(() => {
        models.eventAdmin.bulkCreate(eventAdminArray);
    }).then((data) => {
        res.json(1);
    }).catch(error => {
        debug(error)
        res.status(400).json({
            code: 7,
            data: error,
            message: "Could not add event admins"
        })
    });
});
module.exports = router;
