var router = require('express').Router();
var debug = require('debug')('public');
var models = require('../../models');
var constant = require('../../constant');

router.use('/college', require('./college'));
router.use('/event', require('./event'));
router.use('/student', require('./student'));
router.use('/highlight', require('./highlight'));

/**
 * @api {get} /public/leaderboard leaderboard
 * @apiGroup Public
 * @apiVersion 0.2.0
 * @apiDescription Get the leaderbaord of the students, based on the scores
 * @apiSuccessExample leaderboard
 * [
	{
		"id": 100006,
		"name": "John Doe",
		"score": 119,
		"college": "mycollege"
	},
	{
		"id": 100000,
		"name": null,
		"score": 8,
		"college": "not specified"
	},
	{
		"id": 100001,
		"name": null,
		"score": 0,
		"college": "not specified"
	},
	{
		"id": 100002,
		"name": null,
		"score": 0,
		"college": "not specified"
	}
]

@apiErrorExample error
{"code":11,"message":"Student could not be found"}
 */
router.get('/leaderboard', (req, res, next) => {
    models.student.findAll({
        where: {},
        order: [
            ['score', 'DESC']
        ],
        include: [{
            model: models.college,
            attributes: ['name']
        }],
        attributes: ['id', 'name', 'score']
    }).then(leaderboard => {
        leaderboard = leaderboard.map(x => {
            object = {};
            object.id = x.id;
            object.name = x.name;
            object.score = x.score;
            if (x.college && x.college.name)
                object.college = x.college.name;
            else
                object.college = "not specified";
            return object;
        })
        return res.json(leaderboard);
    }).catch(error => {
        return res.status(400).json(constant.studentNotFound);
    })
});

/**
 * @api {get} /public/collegeLeaderboard college leaderboard
 * @apiGroup Public
 * @apiVersion 0.2.0
 * @apiDescription Get the leaderbaord of the colleges based on event result points
 * @apiSuccessExample collegeLeaderboard
 * [
	{
		"points": 8,
		"college": "mycollege"
	},
	{
		"points": 2,
		"college": "mycollege2"
	}
]
 
 * @apiErrorExample error
 * {"code":25,"message":"The result for this event could not be found"}
 */
router.get('/collegeLeaderboard', (req, res, next) => {
    models.result.findAll({
        where: {},
        order: [
            ['points', 'DESC']
        ],
        include: [{
            model: models.college,
            attributes: ['name']
        }],
        attributes: [
            [models.sequelize.fn('sum', models.sequelize.col('points')), 'points']
        ],
        group: ['collegeId']
    }).then(leaderboard => {
        leaderboard = leaderboard.map(x => {
            object = {};
            object.points = x.points;
            if (x.college && x.college.name)
                object.college = x.college.name;
            else
                object.college = "not specified";
            return object;
        })
        return res.json(leaderboard);
    }).catch(error => {
        constant.resultNotFound.data = error;
        return res.status(400).json(constant.resultNotFound);
    })
});

module.exports = router;