var router = require('express').Router();
var debug = require('debug')('public');
var models = require('../../models');
var constant = require('../../constant');

/**
 * @api {get} /public/highlight get highlights
 * @apiDescription get all highlights 
 * @apiGroup Public/Highlights
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} success
 * [
  {
    "id": 1,
    "name": "blahbitty",
    "image": "http://someimagelink.jpg",
    "promo": "tommyjerro",
    "createdAt": "2017-02-22T12:14:04.000Z",
    "updatedAt": "2017-02-22T12:14:04.000Z"
  },
  {
    "id": 2,
    "name": "assdef region",
    "image": "http://someotherimagelink.jpg",
    "promo": "oscarry",
    "createdAt": "2017-02-22T12:14:09.000Z",
    "updatedAt": "2017-02-22T12:14:38.000Z"
  }
]

*
* @apiErrorExample {json} error
* {"code":18,"message":"Could not fetch highlights"}
 */
router.get('/', (req, res, next) => {
    models.highlight.findAll()
        .then(result => {
            return res.json(result);
        }).catch(error => {
            constant.cantfetchHighlights.data = error;
            return res.status(400).json(constant.cantfetchHighlights);
        });
});

module.exports = router;
