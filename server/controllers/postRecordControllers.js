const express = require('express');
var router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const keys = require('../config/keys');
var ObjectID = require('mongoose').Types.ObjectId;

// load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateUpdateInput = require('../validation/update');

// load PostRecord model
var { PostRecord } = require('../models/postRecord')

// register route
router.post('/signup', (req, res) => {
    // form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    PostRecord.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newPostRecord = new PostRecord({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                textarea: req.body.textarea,
                dept: req.body.dept,
                courses: req.body.courses,
                panel: req.body.panel
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPostRecord.password, salt, (err, hash) => {
                    if (err) throw err;
                    newPostRecord.password = hash;
                    newPostRecord
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// login route
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    PostRecord.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// get all PostData route
router.get('/', (req, res) => {
    PostRecord.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('error while retrieving all data: '+JSON.stringify(err, undefined, 2))
    })
})

// update route
router.put('/:id', (req, res) => {
    // form validation
    const { errors, isValid } = validateUpdateInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)
    
    var updatedRecord = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        textarea: req.body.textarea,
        dept: req.body.dept,
        courses: req.body.courses,
        panel: req.body.panel
    }

    PostRecord.findOne({ email: updatedRecord.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
        PostRecord.findByIdAndUpdate(req.params.id, { $set: updatedRecord }, {new: true}, (err, doc) => {
            if(!err) res.send(doc)
            else console.log('Error while updating a record : '+JSON.stringify(err, undefined, 2))
        })
    }
    
    })
})

// delete route
router.delete('/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)
    
    PostRecord.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) res.send(doc)
        else console.log('Error while deleting a record : '+JSON.stringify(err, undefined, 2))
    })
})



module.exports = router