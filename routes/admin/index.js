var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(401).send('unauthorzed access');
});

module.exports = router;
