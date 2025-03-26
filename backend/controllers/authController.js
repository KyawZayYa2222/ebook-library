const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

// Post login 
exports.postLogin = [
    check('email', 'Please enter a valid email')
        .notEmpty()
        .bail()
        .isEmail()
        .withMessage('Invalid email address'),
    check('password', 'Please enter a valid password').notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Process form data
        const { email, password } = req.body;

        // Find user by email
        User.findOne({ email })
           .then(user => {
                if (!user) {
                    return res.status(400).json({ errors: [
                        {
                            path: 'email',
                            msg: 'User not found'
                        }
                    ] });
                }

                // Check password
                // just simple password check cause this is for private auth for admin created by dev team 
                if(user.password !== password) {
                    return res.status(400).json({ errors: [
                        {
                            path: 'password',
                            msg: 'Incorrect password'
                        }
                    ] });
                }

                // create jwt token 
                console.log(user);
                // console.log(process.env.SECRET_KEY)
                const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY);
                // console.log('token' + token)
                return res.status(200).json({
                    message: "Logged in successfully",
                    access_token: token,
                    user: user
                })
                
            })
           .catch(err => {
            console.error(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err
            })
           });
    }
];