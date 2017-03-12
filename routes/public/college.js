var router = require('express').Router();
var models = require('../../models');
var debug = require('debug')('public');
var constant = require('../../constant');
/**
 * @api {get} /public/college get all colleges
 *
 * @apiDescription get the models of all colleges from the database, used in lists where colelge selection is to be done
 * @apiGroup Public/College
 * @apiSuccessExample success
 * [
 *   {
 *     "id": 1,
 *     "name": "dfghj",
 *     "createdAt": null,
 *     "updatedAt": null
 *   }
 * ]
 * 
 * @apiErrorExample error
 * {
        code: 12,
        message: "Could not fetch college list"
   }
		 */
router.get('/', (req, res, next) => {
    models.college.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        .then(result => {
            res.json(result);
        }).catch(error => {
            res.status(400).json(constant.cantFetchCollege);
        });
});

/**
 * @api {put} /public/college/ add college
 * @apiDescription add a new college to server
 * @apiVersion 0.2.0
 * @apiGroup Admin
 * @apiParam {string} name college name
 * @apiSuccessExample success
 * {
  "id": 8,
  "name": "New College",
  "updatedAt": "2017-03-11T18:28:33.000Z",
  "createdAt": "2017-03-11T18:28:33.000Z"
}

    @apiErrorExample error
    {"code":22,"message":"Could not put college"}
 */
router.put('/', (req, res, next) => {
    models.college.create(req.body)
        .then(result => {
            return res.json(result);
        }).catch(error => {
            constant.cantPutCollege.data = error;
            return res.status(400).json(constant.cantPutCollege);
        })
});

module.exports = router;