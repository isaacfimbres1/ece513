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
    //console.log(req.body);
    Activity.find({createdTime: req.body.startTime}, function(err, activities){
        console.log(activities);
        if (err) {
            res.status(400).send(err);
        }
        else{
            var tempPoint = {
                speed: req.body.speed,
                uv: req.body.uv,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                timeStamp: req.body.timeStamp
            };

            Activity.update(
                { _id: activities._id},
                { $push: {points: point }},
                done
            );
            res.status(200).json({
                success: true,
                threshold: user.threshold
            });
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
    
    Device.findOne({deviceId: req.body.deviceId}, function(err, device){
        console.log("Looking for device" + req.body.deviceId);
        if(err || !device){
            res.status(400).send({success: false, error: err});
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
        

module.exports = router;