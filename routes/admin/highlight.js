var router = require('express').Router();
var debug = require('debug')('public');
var models = require('../../models');
var constant = require('../../constant');
var fcm = require('../fcm');
/**
 * @api {put} /dcms-admin/highlight put a highlight
 * @apiDescription create a highlight entry in table
 * @apiVersion 0.1.0
 * @apiGroup Admin/Highlight
 *
 * @apiParamExample {json} request
 * {
    "name":"somename",
    "image":"imageurl",
    "promo":"blasphemy"
    }

 * @apiSuccessExample {json} success
 * {
  "id": 3,
  "name": "somename",
  "image": "imageurl",
  "promo": "blasphemy",
  "updatedAt": "2017-02-22T12:30:08.000Z",
  "createdAt": "2017-02-22T12:30:08.000Z"
}
 *   
 * @apiErrorExample {json} error
 * {"code":19,"message":"Could not create highlights"}
 * @apiUse  tokenErrors
 */
router.put('/', (req, res, next) => {
    models.highlight.create(req.body)
        .then(result => {
            fcm.updateHighlightSync();
            return res.json(result);
        }).catch(error => {
            constant.cantcreateHighlights.data = error;
            return res.status(400).json(constant.cantcreateHighlights);
        })
});
/**
 * @api {post} /dcms-admin/highlight/:id edit a highlight
 * @apiDescription Edit a highlight entry already present in table
 * @apiVersion 0.1.0
 * @apiGroup Admin/Highlight
 *
 * @apiParam {id} :id id of the highlight to edit
 * @apiParamExample {json} request
 * {
    "name":"somename",
    "image":"imageurl",
    "promo":"blasphemy"
    }

 * @apiSuccessExample {json} success
 * [1]
 *   
 * @apiErrorExample {json} error
 * {"code":20,"message":"Could not edit highlights"}
 * @apiUse  tokenErrors
 */
router.post('/:id', (req, res, next) => {
    models.highlight.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        fcm.updateHighlightSync();
        return res.json(result);
    }).catch(error => {
        constant.cantEditHighlight.data = error;
        return res.status(400).json(constant.cantEditHighlight);
    })
})
module.exports = router;
