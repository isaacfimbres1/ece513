var express = require('express');
var router = express.Router();

var User = require("../models/user");


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
    // Create a student from the submitted form data
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        deviceId: req.body.deviceId,
    });
    
    user.save(function(err, stu) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send("user was saved.");
        }
    });
    
});


module.exports = router;