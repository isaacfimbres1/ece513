var db = require("../db");

var uveventSchema = new db.Schema({
    speed: Number,
    uv: Number,
    latitude: Number,
    longitude: Number,
    recorded: { type: Date, default: Date.now }
});

var UVEvent = db.model("UVEvent", uveventSchema);

module.exports = UVEvent;