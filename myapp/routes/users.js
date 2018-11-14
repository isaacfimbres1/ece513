var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var jwt = require("jwt-simple");
var fs = require('fs');
var Device = require("../models/device");
var User = require("../models/user");


var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

//var app = express();

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static("public"));

///* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});
//
////var User = db.model("User", {
////    name: String,
////    email: String,
////    password: String,
////    deviceId: Number
////});

router.post("/create", function(req, res) {
    // res.send(req);

    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        if(err){
            console.log(err)
        }
        else{
            // Create a user from the submitted form data
            var user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: hash,
                deviceId: [],
            });

            user.save(function(err, use) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(use);
                }
            });
        }
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
        else {
            console.log("password is: " + req.body.password);
            console.log("hash is: " +  user.passwordHash);

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



module.exports = router;