var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
mongoose.connection.on("open", function () {
    console.log("%j", mongoose.connection.collection);
    // mongoose.connection.db.collectionNames(function (error, names) {
    //     console.log(names);
    //     mongoose.disconnect();
    // });
    // mongoose.disconnect();
});
var Schema = mongoose.Schema;
var pS = new Schema({
    name: String
}, { collection: "prod" });
var P = mongoose.model("P", pS);
var newP = new P({
    name: "1"
});
newP.save(function (error, doc) {
    console.log("%j", doc);
});

mongoose.disconnect();