var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var jwt = require("jwt-simple");
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");
var UVEvent = require("../models/event");
var Activity = require("../models/activity");


//speed: Number,
//    uv: Number,
//        latitude: Number,
//            longitude: Number,
//                recorded: { type: Date, default: Date.now }

router.post('', function(req, res, next) {
     Device.findOne({deviceId: req.body.deviceId, apikey: req.body.apikey }, function(err, device){
        if(err){
            res.status(401).send(err);
        }
        else if(device){
            if(!req.body.uvthreshold){
                
                
                Activity.findOne({deviceId: req.body.deviceId, createdTime: new Date(req.body.startTime) }, function(err, activity){
                    if (err) {
                        res.status(400).send(err);
                    }
                    else{
                        if(activity) {
                            var tempPoint = {
                                speed: req.body.speed,
                                uv: req.body.uv,
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                                timeStamp: req.body.timeStamp
                            };
                            
                            activity.points.push(tempPoint);
                            activity.save(function(err, activity) {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    res.status(200).send({
                                        success: true
                                    });
                                }});

                            console.log("*********************Save Created****************************");
                        }
                        else{
                            console.log("*********************New Point Created****************************");
                            var newActivity = new Activity({
                                deviceId: req.body.deviceId,
                                createdTime: new Date(req.body.startTime),
                                type: "unknown",
                                points: [{
                                    latitude: req.body.latitude,
                                    longitude: req.body.longitude,
                                    speed: req.body.speed,
                                    uv: req.body.uv,
                                    timeStamp: req.body.timeStamp
                                }]
                            });

                            newActivity.save(function(err, use){
                                if(err) {
                                    res.status(400).send(err);
                                }
                                else {
                                    console.log(use._id);
                                    console.log(use.createdTime);
                                }  
                            });
                        }
//                        res.status(200).json({
//                            success: true,
//                            timestamp: req.body.timeStamp
//                        });
                    }        

                });
            }
        }
    });
});

router.get('/:devid', function(req, res, next) {
    var deviceId = req.params.devid;
    var responseJson = { events: []};

    if (deviceId === "all") {
      var query = {};
    }
    else {
      var query = {
          "deviceId" : deviceId
      };
    }
    
    UVEvent.find(query, function(err, allEvents) {
      if (err) {
        var errorMsg = {"message" : err};
        res.status(400).json(errorMsg);
      }
      else {
         for(var doc of allEvents) {
            responseJson.events.push({
                "deviceId": doc.deviceId, 
                speed: doc.speed,
                uv: doc.uv,
                latitude: doc.latitude,
                longitude: doc.longitude,
                recorded: doc.recorded
            });
         }
      }
      res.status(200).json(responseJson);
    });
    
});


router.get('', function(req, res, next) {
    res.status(200).send({
        success: true
    });
    
});

router.post('/config', function(req, res, next) {
    
    Device.findOne({deviceId: req.body.deviceId, apikey: req.body.apikey}, function(err, device){
        console.log("Looking for device" + req.body.deviceId);
        if(err || !device){
            res.status(401).send({success: false, error: err});
            console.log(err);
        }
        else{
            console.log("Looking for email" + device.userEmail);
            User.findOne({email: device.userEmail}, function(err, user){
                if(err || !user){
                    res.status(400).send({success: false, error: err});
                    console.log(err);
                }
                else{
                    console.log({
                        success: true,
                        threshold: user.threshold
                    });
                    res.status(200).json({
                        success: true,
                        threshold: user.threshold
                    });
                }
                
            });
        }
        
        
    }); 
});

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
        

module.exports = router;