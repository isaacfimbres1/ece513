var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var jwt = require("jwt-simple");
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");
var Activity = require("../models/activity");
var jwtAdvanced = require("jsonwebtoken");

var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

//url: /activites/

//url: /activites/account
router.get("/account" , function(req, res) {
    // Check for authentication token in x-auth header
    if (!req.headers["x-auth"]) {
        return res.status(401).json({success: false, message: "No authentication token"});
    }

    var authToken = req.headers["x-auth"];

    try {
        var decodedToken = jwt.decode(authToken, secret);
        var data = [];

        Device.find({ userEmail : decodedToken.email}, function(err, devices) {
            if(err) {
                return res.status(200).json({success: false, message: "User has no devices."});
            }
            else {
                for (device of devices) {
                    Activity.find({deviceId: device.deviceId}, function(err, activities){
                        if(err){
                            return res.status(200).json({success: false, message: "Device has no activites."});
                        }
                        else{
                            for(activity of activities){
                                data.push(activity);
                            }
                        } 
                    });
                }

                return res.status(200).json(data);            
            }       
        });
    }
    catch (ex) {
        return res.status(401).json({success: false, message: "Invalid authentication token."});
    }
});

//url: /activites/:id
router.get("/:id" , function(req, res) {
    // Check for authentication token in x-auth header
    if (!req.headers["x-auth"]) {
        return res.status(401).json({success: false, message: "No authentication token"});
    }

    var authToken = req.headers["x-auth"];

    try {
        var decodedToken = jwt.decode(authToken, secret);
        var activityId = req.params.id;
        var data = [];
        console.log("act id: " + activityId);

        Activity.findById(activityId, function (err, activity){
            if(err){
                return res.status(400).json({success: false, message: "Error with that id"});
            }
            else if(activity === null){
                return res.status(400).json({success: false, message: "Couldn't find activity with that id"});
            }
            else{
                //verify that the user and device id match
                console.log("Looking for " + activity.deviceId + " and " + decodedToken.email );
                Device.findOne({deviceId: activity.deviceId, userEmail: decodedToken.email}, function (err, device) {
                    console.log("error" + err);
                    console.log("device" + device);
                    if(device){
                        return res.status(200).json(activity);
                    }
                    else{
                        return res.status(400).json({success: false, message: "Couldn't find valid device"});
                    } 
                });
            }
        });

    }
    catch (ex) {
        return res.status(401).json({success: false, message: "Invalid authentication token."});
    }
});





module.exports = router;