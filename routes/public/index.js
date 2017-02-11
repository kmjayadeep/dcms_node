var router = require('express').Router();

router.use('/college', require('./college'));
router.use('/event', require('./event'));
router.use('/student', require('./student'));

module.exports = router;
