var mongoose = require("mongoose");


mongoose.connect("mongodb://isaacfimbres:ECE513iscool@ec2-18-219-245-250.us-east-2.compute.amazonaws.com:27017/mydb", { useNewUrlParser: true }).then(()=>{
    console.log('MongoDB is connected')
  }).catch((err) =>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds. Error is: ' + err)
    setTimeout(connectWithRetry, 5000)
  })




//mongoose.connect("mongodb://localhost/mydb");
module.exports = mongoose;