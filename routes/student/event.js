var router = require('express').Router();
var debug = require('debug')('student');
var models = require("../../models");
var constant = require("../../constant");


router.put('/:id', (req, res, next) => {
	// models.eventStudent.create()
	res.json({});
});

module.exports = router;
