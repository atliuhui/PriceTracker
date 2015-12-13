var mongoose = require("../helpers/dbconnection").mongoose;
var ENUM_PRODUCT_SOURCE = require("../helpers/global").ENUM_PRODUCT_SOURCE;

module.exports.Product = mongoose.model("Product", new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: "" },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: "product" }));

module.exports.ProductTracker = mongoose.model("ProductTracker", new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: "product"
    source: { type: String, required: true, enum: ENUM_PRODUCT_SOURCE },
    url: { type: String },
    code: { type: String, required: true },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: "producttracker" }));

module.exports.ProductPrice = mongoose.model("ProductPrice", new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: "product"
    source: { type: String, required: true, enum: ENUM_PRODUCT_SOURCE },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    usetime: { type: Number, required: true, default: 0 },
    datetime: { type: Date, required: true },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: "productprice" }));
