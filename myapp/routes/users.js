var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var jwt = require("jwt-simple");
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");
var jwtAdvanced = require("jsonwebtoken");
var nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    //    port: 587,
    //    secure: false, // true for 465, false for other ports
    auth: {
        user: "postmaster@sandboxb34544df91204f348e3a514627e8ddf8.mailgun.org", // generated ethereal user
        pass: "e1913348008272931c4746d38fed6730-52cbfb43-7d99c72e" // generated ethereal password
    }
});


var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

router.post("/create", function(req, res) {
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        if(err){
            console.log(err);
        }
        User.findOne({email: req.body.email}, function(err, user) {
            if(user && user.confirmed){
                res.status(401).json({success : false, error : "User with that email already exists"});         
            }
            else if(user && !user.confirmed){
                jwtAdvanced.sign(
                    {
                        email: user.email,
                    },
                    secret,
                    {
                        expiresIn: '1h',
                    },
                    (err, emailToken) => {
                        if(err){
                            console.log(err);
                            res.status(400).send(err);
                        }
                        else{
                            const url = `http://localhost:3000/users/confirmation/${emailToken}`;

                            transporter.sendMail({
                                from: '"UVFit" <uvfit@no-reply>', // sender address
                                to: user.email,
                                subject: 'Confirm Email for UVFit',
                                html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
                            }, (error, info) => {
                                if(error){
                                    console.log(error);
                                    res.status(400).json({success: false, error: "Couldn't send email. Likely because we are using a sandbox which limits the amount of emails sent"});
                                }
                                else{
                                    console.log(info);
                                    res.status(200).json({success: true, message: "Email Verification Sent"});
                                }
                            });
                        }
                    },
                );

            }
            else{
                // Create a user from the submitted form data
                var user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    passwordHash: hash,
                    deviceId: [],
                    confirmed: false
                });

                user.save(function(err, use) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        console.log(use._id);
                        console.log(use.email);
                        //create authentication token for email verification
                        jwtAdvanced.sign(
                            {
                                email: use.email,
                            },
                            secret,
                            {
                                expiresIn: '1h',
                            },
                            (err, emailToken) => {
                                if(err){
                                    console.log(err);
                                    res.status(400).send(err);
                                }
                                else{
                                    const url = `http://localhost:3000/users/confirmation/${emailToken}`;

                                    transporter.sendMail({
                                        from: '"UVFit" <uvfit@no-reply.com>', // sender address
                                        to: use.email,
                                        subject: 'Confirm Email for UVFit',
                                        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
                                    }, (error, info) => {
                                        if(error){
                                            console.log(error);
                                            res.status(400).json({success: false, error: "Couldn't send email. Likely because we are using a sandbox which limits the amount of emails sent"});
                                        }
                                        else{
                                            console.log(info);
                                            res.status(200).json({success: true, message: "Email Verification Sent"});
                                        }
                                    });
                                }
                            },
                        );
                    }
                });
            }
        });
    });
});

router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.status(401).json({success : false, error : "Error communicating with database."});
        }
        else if(!user) {
            res.status(401).json({success : false, error : "The email or password provided was invalid."});         
        }
        else if(!user.confirmed){
            res.status(401).json({success : false, error : "Email has not been verified"});         
        }
        else {
            bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
                if (err) {
                    res.status(401).json({success : false, error : "Error authenticating. Please contact support."});
                }
                else if(valid) {
                    var token = jwt.encode({
                        email: req.body.email,
                        name: req.body.name 
                    }, secret);
                    res.status(201).json({success : true, token : token});         
                }
                else {
                    res.status(401).json({success : false, error : "The email or password provided was invalid."});         
                }
            });
        }
    });
});

router.get("/account" , function(req, res) {
    // Check for authentication token in x-auth header
    if (!req.headers["x-auth"]) {
        return res.status(401).json({success: false, message: "No authentication token"});
    }

    var authToken = req.headers["x-auth"];

    try {
        var decodedToken = jwt.decode(authToken, secret);
        var userStatus = {};

        User.findOne({email: decodedToken.email}, function(err, user) {
            if(err) {
                return res.status(200).json({success: false, message: "User does not exist."});
            }
            else {
                userStatus['success'] = true;
                userStatus['email'] = user.email;
                userStatus['name'] = user.name;
                userStatus['lastAccess'] = user.lastAccess;

                // Find devices based on decoded token
                Device.find({ userEmail : decodedToken.email}, function(err, devices) {
                    if (!err) {
                        // Construct device list
                        var deviceList = []; 
                        for (device of devices) {
                            deviceList.push({ 
                                deviceId: device.deviceId,
                                apikey: device.apikey,
                            });
                        }
                        userStatus['devices'] = deviceList;
                    }

                    return res.status(200).json(userStatus);            
                });
            }
        });
    }
    catch (ex) {
        return res.status(401).json({success: false, message: "Invalid authentication token."});
    }

});

router.put("/email", function(req, res) {

    //TODO validate new email

    var query = {
        email: req.body.email
    } 
    User.findOneAndUpdate(query, {email: req.body.updatedEmail}, function(err, user) {
        if (err) {
            res.status(400).send(err);
        } 
        else {
            Device.updateMany(query, {email : req.body.updatedEmail}, function(err, devices){
                if(err){
                    res.status(400).send(err);
                }
                else{
                    var token = jwt.encode({
                        email: req.body.updatedEmail,
                        name: req.body.name 
                    }, secret);
                    res.status(201).json({success : true, token : token});   
                }
            });
        }
    });
});

router.put("/name", function(req, res) {
    var query = {
        email: req.body.email
    } 
    User.findOneAndUpdate(query, {name: req.body.name}, function(err, user) {
        if (err) {
            res.status(400).send(err);
        } else {
            var token = jwt.encode({
                email: req.body.email,
                name: req.body.name 
            }, secret);
            res.status(201).json({success : true, token : token});     
        }
    });
});

router.put("/password", function(req, res) {
    var query = {
        email: req.body.email
    }

    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        if(err){
            console.log(err)
        }
        else{
            User.findOneAndUpdate(query, {passwordHash: hash}, function(err, user) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(201).send(user);     
                }
            });
        }
    });  
});

router.get("/confirmation/:token", function(req, res){
    try {
        var token = jwtAdvanced.verify(req.params.token, secret);
        let query={
            "email" : token.email
        }
        console.log("token: " + token.email);
        User.findOneAndUpdate(query, {confirmed: true}, function(err, user) {
            if(err){
                res.status(400).send(err);
            }
            else{
                console.log(user);
                return res.status(200).redirect('http://localhost:3000/');
                //res.status(201).send(user);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});


module.exports = router;