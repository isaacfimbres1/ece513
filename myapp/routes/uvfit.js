var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var jwt = require("jwt-simple");
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");
var UVEvent = require("../models/event");


//speed: Number,
//    uv: Number,
//        latitude: Number,
//            longitude: Number,
//                recorded: { type: Date, default: Date.now }

router.post('', function(req, res, next) {
    console.log(req.body);
    var uvevent = new UVEvent({
        deviceId: req.body.deviceId,
        speed: req.body.speed,
        uv: req.body.uv,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        
    });

    uvevent.save(function(err, e) {
        if (err) {
            res.status(400).send(err);
        }   else {
            res.status(200).send(e);
        }
    });

});

router.get('/:devid', function(req, res, next) {
    var deviceId = req.params.devid;
    var responseJson = { events: []};

    if (deviceId == "all") {
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

module.exports = router;