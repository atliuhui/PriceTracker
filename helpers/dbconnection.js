var util = require("util");
var mongoose = require("mongoose");

var DB_URI = require("./global").DB_URI;

mongoose.connect(DB_URI, { server: { auto_reconnect: true } });
console.log("creating global mongoose connection");

mongoose.connection.on("connected", function () {
    console.log("mongoose connection success");
});

mongoose.connection.on("close", function () {
    mongoose.connect(DB_URI, { server: { auto_reconnect: true } });
    console.log("mongoose reconnection success");
});

mongoose.connection.on("error", function (error) {
    console.log(util.format("mongoose connection error: %s", error));
});

mongoose.connection.on("disconnected", function () {
    console.log("mongoose disconnected");
});

process.on("SIGINT", function () {
    mongoose.connection.close(function () {
        console.log("mongoose disconnected through service termination");
        process.exit(0);
    });
});

module.exports.mongoose = mongoose;
