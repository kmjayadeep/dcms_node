var express = require('express');
var router = express.Router();
var models = require('../../models');
var debug = require('debug')('admin');
var _ = require('underscore');
constant = require('../../constant');
var superAdminStatus = 10;
router.use('/auth', require('./auth'));
router.use('/event', require('./event'));
router.use('/workshop', require('./workshop'));
router.use('/student', require('./student'));
router.use('/volunteer', require('./volunteer'));
router.use('/highlight', require('./highlight'));

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
    "name": "John Doe",
    "uid": "cJ2crx0lpVSbvPs1VbhU0BHgItE2",
    "email": "johndoe@gmail.com",
    "phone": null,
    "picture": "https://lh6.googleusercontent.com/-LdIUNFJBriQ/AAAAAAAAAAI/AAAAAAAAAvI/HUwlqct9yJY/photo.jpg",
    "status": 10,
    "eventMail": null,
    "createdAt": "2017-02-12T08:22:13.000Z",
    "updatedAt": "2017-02-12T14:01:35.000Z"
  }
]

 * @apiUse tokenErrors
 */
router.get('/', (req, res, next) => {
    debug(req.query)
    models.admin.findAll({
        where: req.query
    }).then((list) => {
        res.json(list);
    }).catch(error => {
        res.status(400)
            .json({
                code: 8,
                data: error,
                message: "Could not fetch admins"
            });
    })
});

/**
 * @apiDefine optional
 * 
 * @apiParam {Integer} [id] Admin Id
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
 * @api {get} /dcms-admin/:id get admin
 * @apiName Get Admin
 * @apiGroup Admin
 *
 *@apiUse optional

 * @apiSuccessExample {json} success
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

 * @apiUse tokenErrors
 */
router.get('/:id', (req, res, next) => {
    debug(req.params.id)
    models.admin.findOne({
        where: {
            id: req.params.id
        }
    }).then((admin) => {
        if (admin)
            res.json(admin);
        else
            throw 'invalid id'
    }).catch(error => {
        res.status(400)
            .json({
                code: 8,
                data: error,
                message: "Could not fetch admin"
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
    let body = _.pick(req.body, 'name', 'phone', 'eventMail', 'status')
    try {
        debug(body)
        if (req.admin.status < superAdminStatus) {
            return res.status(401).json(constant.needsSuperAdmin);
        }

        models.admin.update(
                body, {
                    where: {
                        id: req.params.id
                    }
                })
            .then(result => {
                res.json(result);
            }).catch(error => {
                constant.cannotEditAdmin.error = error;
                res.status(400).json(constant.cannotEditAdmin);
            });
    } catch (err) {
        debug(err);
    }
});

module.exports = router;
