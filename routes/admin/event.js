var router = require('express').Router();
var debug = require('debug')('event')
var models = require('../../models');

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
            res.status(400)
                .send({
                    code: 3,
                    data: error,
                    message: "Could not create Event"
                })
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
        res.status(400)
            .send({
                code: 4,
                data: error,
                message: "Could not fetch events"
            })
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
        res.status(400).send({
            code: 5,
            data: error,
            message: "Could not delete events"
        });
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
        res.send("success");
    }).catch(error => {
        res.status(400).send({
            code: 6,
            data: error,
            message: "Could not edit events"
        });
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
router.put('/admin', (req, res, next) => {
    var eventAdminArray = req.body.adminIds.map(adminId => {
        return {
            eventId: req.body.eventId,
            adminId: adminId
        }
    });
    debug(eventAdminArray)
    models.eventAdmin.destroy({
        where: {
            eventId: req.body.eventId
        }
    }).then(() => {
        models.eventAdmin.bulkCreate(eventAdminArray);
    }).then(() => {
        res.send("success");
    }).catch(error => {
        debug(error)
        res.status(400).send({
            code: 7,
            data: error,
            message: "Could not add event admins"
        })
    });
});
module.exports = router;