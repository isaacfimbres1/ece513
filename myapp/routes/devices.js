var express = require('express');
var router = express.Router();
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");
var jwt = require("jwt-simple");

/* Authenticate user */
var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
    var newApikey = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
        newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return newApikey;
}

// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
    var deviceId = req.params.devid;
    var responseJson = { devices: [] };

    if (deviceId == "all") {
        var query = {};
    }
    else {
        var query = {
            "deviceId" : deviceId
        };
    }

    Device.find(query, function(err, allDevices) {
        if (err) {
            var errorMsg = {"message" : err};
            res.status(400).json(errorMsg);
        }
        else {
            for(var doc of allDevices) {
                responseJson.devices.push({ "deviceId": doc.deviceId,  "lastContact" : doc.lastContact});
            }
        }
        res.status(200).json(responseJson);
    });
});

router.get('/:email', function(req, res, next) {
    var userStatus = {};

    User.findOne({email: req.params.email}, function(err, user) {
        if(err) {
            return res.status(400).json({success: false, message: "User does not exist."});
        }
        else {

            // Find devices based on decoded token
            Device.find({ userEmail : req.params.email}, function(err, devices) {
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


});



router.put('/register', function(req, res, next) {
    var responseJson = {
        registered: false,
        message : "",
        apikey : "none"
    };
    var deviceExists = false;

    // Ensure the request includes the deviceId parameter
    if( ! "devidId" in req.body) {
        responseJson.message = "Missing deviceId.";
        return res.status(400).json(responseJson);
    }

    var email = "";

    // If authToken provided, use email in authToken 
    if (req.headers["x-auth"]) {
        try {
            var decodedToken = jwt.decode(req.headers["x-auth"], secret);
            email = decodedToken.email;
        }
        catch (ex) {
            responseJson.message = "Invalid authorization token.";
            return res.status(400).json(responseJson);
        }
    }
    else {
        // Ensure the request includes the email parameter
        if( !req.body.hasOwnProperty("email")) {
            responseJson.message = "Invalid authorization token or missing email address.";
            return res.status(400).json(responseJson);
        }
        email = req.body.email;
    }
    
    deviceApikey = getNewApikey();
    
    var query = { userEmail: email };
    var newData = {
        userEmail : email,
        deviceId : req.body.deviceId,
        apikey : deviceApikey,
    }
    
    Device.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.status(400).json({ error: err });
        return res.status(200).json(doc);
    });

    // See if device is already registered
//    Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
//        if (device !== null) {
//            responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
//            return res.status(400).json(responseJson);
//        }
//        else {
//            // Get a new apikey
//            deviceApikey = getNewApikey();
//
//            // Create a new device with specified id, user email, and randomly generated apikey.
//            var newDevice = new Device({
//                deviceId: req.body.deviceId,
//                userEmail: email,
//                apikey: deviceApikey
//            });
//
//            // Save device. If successful, return success. If not, return error message.
//            newDevice.save(function(err, newDevice) {
//                if (err) {
//                    console.log("Error: " + err);
//                    responseJson.message = err;
//                    // This following is equivalent to:
//                    //     res.status(400).send(JSON.stringify(responseJson));
//                    return res.status(400).json(responseJson);
//                }
//                else {
//                    responseJson.registered = true;
//                    responseJson.apikey = deviceApikey;
//                    responseJson.message = "Device ID " + req.body.deviceId + " was registered.";
//                    return res.status(201).json(responseJson);
//                }
//            });
//        }
//    });
});

router.delete('/id', function(req, res, next) {
    Device.remove({ deviceId : req.body.deviceId}, function(err) {
        if(err){
            res.status(400).send(err);
        }
        else{
            res.status(200).json({success: true});
        }
    });
});

module.exports = router;