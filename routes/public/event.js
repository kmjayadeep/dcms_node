var router = require('express').Router();
var debug = require('debug')('public');
var models = require('../../models');
var constant = require('../../constant');
/**
 * @api {get} /public/event/ get event list
 * @apiName Get Events
 * @apiGroup Public/Event
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
 * @api {get} /public/event/:id get event
 * @apiName Get Event
 * @apiGroup Public/Event
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
}
 */
router.get('/:id', (req, res, next) => {
    let event = null
    models.event.findOne({
        where: {
            id: req.params.id
        }
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
