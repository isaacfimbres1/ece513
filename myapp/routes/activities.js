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





module.exports = router;