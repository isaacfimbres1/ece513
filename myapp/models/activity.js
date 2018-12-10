var db = require("../db");

var activitySchema = new db.Schema({
    deviceId: String,
    createdTime :  { type: Date, default: Date.now },
    points : [{
        latitude: Number,
        longitude: Number,
        speed: Number,
        uv: Number,
        timeStamp: { type: Date, default: Date.now }
    }]
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;

//db.activities.insert({
//    deviceId: "350018000e47363336383437", 
//    createdTime : ISODate("2018-11-14T05:47:10.272Z"),
//    points: [{
//            latitude: 32.231491,
//            longitude: -110.951126,
//            speed: 0.2,
//            uv: 1,
//            timeStamp: ISODate("2018-11-14T05:47:10.272Z")   
//        },
//        {
//             latitude: 32.231655,
//             longitude: -110.951103,
//             speed: 0.34,
//             uv: 1,
//             timeStamp: ISODate("2018-11-14T05:49:07.709Z")
//         },
//         {
//             latitude: 32.231655,
//             longitude: -110.951103,
//             speed: 0.34,
//             uv: 1,
//             timeStamp: ISODate("2018-11-14T05:49:09.799Z")
//         }  
//    ]
//}); 

//db.activities.insert({
//    deviceId: "350018000e47363336383437", 
//    createdTime : ISODate("2018-11-15T05:47:10.272Z"),
//    points: [{
//            latitude: 32.231491,
//            longitude: -110.951126,
//            speed: 0.2,
//            uv: 1,
//            timeStamp: ISODate("2018-11-15T05:47:10.272Z")   
//        },
//        {
//             latitude: 32.231655,
//             longitude: -110.951103,
//             speed: 0.34,
//             uv: 1,
//             timeStamp: ISODate("2018-11-15T05:49:07.709Z")
//         },
//         {
//             latitude: 32.231655,
//             longitude: -110.951103,
//             speed: 0.34,
//             uv: 1,
//             timeStamp: ISODate("2018-11-15T05:49:09.799Z")
//         }  
//    ]
//}); 


//db.activites.update({deviceId:210040001647363335343834}, {$push: {points: {
//    latitude: 32.231655,
//    longitude: -110.951103,
//    speed: 0.34,
//    uv: 1,
//    timeStamp: ISODate("2018-11-14T05:49:07.709Z")
//}}});

