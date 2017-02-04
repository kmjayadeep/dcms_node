var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(401).send('unauthorized access');
});


router.use('/auth',require('./auth'))

module.exports = router;