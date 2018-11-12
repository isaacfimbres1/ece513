var mongoose = require("mongoose");
mongoose.connect("mongodb://ec2-18-219-245-250.us-east-2.compute.amazonaws.com/mydb", { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost/mydb");
module.exports = mongoose;