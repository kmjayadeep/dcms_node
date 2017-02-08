var router = require('express').Router();
var models = require('../../models');
var debug = require('debug')('college');
var constant = require('../../constant');
/**
 * @api {get} /public/college get all colleges
 *
 * @apiDescription get the models of all colleges from the database, used in lists where colelge selection is to be done
 * @apiGroup college
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
    models.college.findAll({})
        .then(result => {
            res.json(result);
        }).catch(error => {
            res.status(400).json(constant.cantFetchCollege);
        });
});

module.exports = router;
