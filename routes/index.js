var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Welcome!');
});

router.use('/dcms-admin', require('./admin'))
router.use('/user', require('./user'))
router.use('/public', require('./public'))

module.exports = router;
