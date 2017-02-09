var router = require('express').Router();
var debug = require('debug')('student');
var models = require("../../models");
var constant = require("../../constant");


router.put('/:id', (req, res, next) {
	models.event.findOne({
		where:{
			id:id
		}
	}).then(result=>{
		// if(event.group){

		// }else{

		// }
		res.json({});
	}).catch(error=>{
		constant.noEventError.data = error;
		return res.status(400).json(constant.noEventError);
	})
});

module.exports = Router;
