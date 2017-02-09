var router = require('express').Router();

router.use('/college', require('./college'));
router.use('/event', require('./event'));

module.exports = router;
