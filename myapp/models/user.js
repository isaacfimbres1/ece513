var db = require("../db");

var User = db.model("User", {
    name: String,
    email: String,
    passwordHash: String,
    deviceId: [Number],
    confirmed: Boolean,
    threshold: Number
});

module.exports = User;