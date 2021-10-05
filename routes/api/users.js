const express = require('express');
const router = express.Router();


// @route POST api/users 
// @desc Register route
// @access Public

router.post('/', (req, res) => res.send('user route'));

module.exports = router;