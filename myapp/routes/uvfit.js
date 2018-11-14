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


router.get('', function(req, res, next) {
    res.status(200).send({
        success: true
    });
    
});

module.exports = router;