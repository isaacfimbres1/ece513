var db = require("../db");

var User = db.model("User", {
    name: String,
    email: String,
    passwordHash: String,
    deviceId: [Number],
    confirmed: Boolean
});

module.exports = User;