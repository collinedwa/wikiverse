const express = require("express");
const router = express.Router();

// different model routers
router.use('/wiki', require('./wiki'));
router.use('/users', require('./users'));
router.use('/tags', require('./tags'));

module.exports = router;
