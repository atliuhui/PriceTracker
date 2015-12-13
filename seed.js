var util = require("util");

var USER_SYSTEM = require("./helpers/global").USER_SYSTEM;

var Product = require("./models/product").Product;
var ProductTracker = require("./models/product").ProductTracker;
var ProductPrice = require("./models/product").ProductPrice;

console.log("init ready");

// ProductPrice.remove({}, function (error) { });
ProductTracker.remove({}, function (error) { });
Product.remove({}, function (error) { });

console.log("init clear done");

var p1 = new Product({
    title: "BOX",
    creator: USER_SYSTEM
});
p1.save();

(new ProductTracker({
    pid: p1.id,
    source: "jd",
    url: util.format("http://item.jd.com/%s.html", "1952025209"),
    code: "1952025209",
    creator: USER_SYSTEM
})).save();
(new ProductTracker({
    pid: p1.id,
    source: "tmall",
    url: util.format("http://detail.tmall.com/item.htm?id=%s", "44783214078"),
    code: "44783214078",
    creator: USER_SYSTEM
})).save();
(new ProductTracker({
    pid: p1.id,
    source: "amazon",
    url: util.format("http://amazon.cn/gp/product/%s", "B002J03PBA"),
    code: "B002J03PBA",
    creator: USER_SYSTEM
})).save();

console.log("init done");
