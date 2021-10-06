const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

// bringing in DB 
const User = require('../../models/User');

// @route POST api/users 
// @desc Register route
// @access Public

router.post('/', 
[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include valid email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
],  async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { //if there are errors
            return res.status(400).json({ errors: errors.array() });
            // send err message
        }

        const { name, email, password, } = req.body;

        try {
        // see if user exists
        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({ errors: [ { msg:'User already exists'} ]});
        }

        // get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = bcrypt.hash(password, salt);
        
        await user.save();

        // return jsonwebtoken (login automatically)

        res.send('user route');

        } catch(err) {
            console.log(err.messsage);
            res.status(500).send('Server Error')
        }


        // console.log(req.body)
});

module.exports = router;