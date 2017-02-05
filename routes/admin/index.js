var express = require('express');
var router = express.Router();
var models = require('../../models');
var debug = require('debug')('admin');

var superAdminStatus = 10;
router.use('/auth', require('./auth'));
router.use('/event', require('./event'));

/**
 * @apiDefine optional
 * 
 * @apiParam {Integer} [id] Column Id
 * @apiParam {String} [name] Name of admin
 * @apiParam {String} [uid] User id
 * @apiParam {String} [email] User email
 * @apiParam {String} [phone] Phone Number
 * @apiParam {Integer} [status] User Status
 */

/**
 * @apiDefine token
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
 * @api {get} /dcms-admin/ get admin list
 * @apiName Get Events
 * @apiGroup Admin
 *
 *@apiUse optional

 * @apiParamExample sample request
 * {
 *   "name": "nisham mohammed",
 * }

 * @apiSuccessExample {json} success
[
  {
    "id": 1,
    "name": "nisham mohammed",
    "uid": "bJ1rrx0lpVSbUPs1WphU0BHfItD2",
    "email": "mnishamk1995@gmail.com",
    "phone": null,
    "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
    "status": 1,
    "createdAt": "2017-02-04T14:02:17.000Z",
    "updatedAt": "2017-02-04T14:02:17.000Z"
  }
]

 * @apiUse token
 */
router.get('/', (req, res, next) => {
    debug(req.query)
    models.admin.findAll({
        where: req.query
    }).then((list) => {
        res.json(list);
    }).catch(error => {
        res.status(400)
            .send({
                code: 8,
                data: error,
                message: "Could not fetch admins"
            });
    })
});


/**
 * @api {post} /dcms-admin/:adminId edit admins
 * @apiGroup Admin
 * @apiDescription Can be used only by super admins, to grant privilage levels to other admins
 *
 * @apiParamExample sample request
{
    "email":"random email"
}

 * @apiSuccessExample {json} edited
    success

 * @apiUse tokenErrors
 */

router.post('/:id', (req, res, next) => {
    if (req.admin.status < superAdminStatus) {
        return res.status(401).send({
            code: 9,
            message: "Needs super admin privilages"
        });
    }
    models.admin.update(
            req.body, {
                where: {
                    id: req.params.id
                }
            })
        .then(result => {
            res.send("success");
        }).catch(error => {
            res.status(400).send({
                code: 6,
                data: error,
                message: "Could not edit events"
            });
        });
});

module.exports = router;
