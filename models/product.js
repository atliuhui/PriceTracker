var mongoose = require('../helpers/dbconnection').mongoose;
var ENUM_PRODUCT_SOURCE = require('../helpers/global').ENUM_PRODUCT_SOURCE;

var ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'product' });
ProductSchema.static('findAll', function (callback) {
    return this.find(callback);
});
module.exports.Product = mongoose.model('Product', ProductSchema);

var ProductTrackerSchema = new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: 'product'
    source: { type: String, required: true, enum: ENUM_PRODUCT_SOURCE },
    url: { type: String },
    code: { type: String, required: true },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'producttracker' });
ProductTrackerSchema.static('findByPId', function (pid, callback) {
    return this.find({ pid: pid }, callback);
});
module.exports.ProductTracker = mongoose.model('ProductTracker', ProductTrackerSchema);

var ProductPriceSchema = new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: 'product'
    source: { type: String, required: true, enum: ENUM_PRODUCT_SOURCE },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    usetime: { type: Number, required: true, default: 0 },
    datetime: { type: Date, required: true },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'productprice' })
ProductPriceSchema.static('findByPId', function (pid, callback) {
    return this.find({ pid: pid })
        .select('source code datetime price usetime')
        .exec(callback);
});
module.exports.ProductPrice = mongoose.model('ProductPrice', ProductPriceSchema);
