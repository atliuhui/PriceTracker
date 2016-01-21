var mongoose = require('../helpers/dbconnection').mongoose;
var ENUM_PRODUCT_SOURCE = require('../helpers/global').ENUM_PRODUCT_SOURCE;

var ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: Array, required: false, default: [] },
    poster: { type: String, required: true },
    content: { type: String, required: false, default: '' },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'product' });
ProductSchema.static('findByPId', function (pid, callback) {
    return this.find({ _id: pid }, callback);
});
ProductSchema.static('findAll', function (callback) {
    return this.find(callback);
});
module.exports.Product = mongoose.model('Product', ProductSchema);

var ProductTrackerSchema = new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: 'product'
    source: { type: String, required: true, enum: ENUM_PRODUCT_SOURCE },
    url: { type: String },
    key: { type: Object, required: true, default: {} },
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
    key: { type: Object, required: true, default: {} },
    price: { type: Number, required: true },
    usetime: { type: Number, required: true, default: 0 },
    datetime: { type: Date, required: true },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'productprice' })
ProductPriceSchema.static('findByPId', function (pid, callback) {
    return this.find({ pid: pid })
        // .select('source code datetime price usetime')
        .exec(callback);
});
ProductPriceSchema.static('getJDLatest', function (pid, callback) {
    return this.find({ pid: pid, source: 'jd' })
        .sort({ datetime: 'desc' })
        .limit(1)
        .exec(callback);
});
ProductPriceSchema.static('getTMALLLatest', function (pid, callback) {
    return this.find({ pid: pid, source: 'tmall' })
        .sort({ datetime: 'desc' })
        .limit(1)
        .exec(callback);
});
ProductPriceSchema.static('getAMAZONLatest', function (pid, callback) {
    return this.find({ pid: pid, source: 'amazon' })
        .sort({ datetime: 'desc' })
        .limit(1)
        .exec(callback);
});
module.exports.ProductPrice = mongoose.model('ProductPrice', ProductPriceSchema);
