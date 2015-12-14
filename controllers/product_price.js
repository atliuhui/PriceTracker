var _ = require("underscore")._;
var async = require("async");

var logger = require("../helpers/logging").getLogger("price");

var Product = require("../models/product").Product;
var ProductTracker = require("../models/product").ProductTracker;
var ProductPrice = require("../models/product").ProductPrice;

var amazon_price = require("./partial/amazon_price.js");
var jd_price = require("./partial/jd_price.js");
var tmall_price = require("./partial/tmall_price.js");

var DICT_PRODUCT_SOURCE = require("../helpers/global").DICT_PRODUCT_SOURCE;
var USER_SYSTEM = require("../helpers/global").USER_SYSTEM;

module.exports.get = function (callback, params) {
    var begintime = new Date();
    async.auto({
        default: function (next) {
            var pid = params.pid;
            var query = ProductTracker.find({ pid: pid });
            query.exec(function (error, trackers) {
                if (error) {
                    logger.error("%o", error);
                    callback(new Error());
                } else {
                    var results = {};

                    _.each(trackers, function (item, index) {
                        switch (item.source) {
                            case DICT_PRODUCT_SOURCE.jd:
                                results.jd = item.code;
                                break;
                            case DICT_PRODUCT_SOURCE.tmall:
                                results.tmall = item.code;
                                break;
                            case DICT_PRODUCT_SOURCE.amazon:
                                results.amazon = item.code;
                                break;
                            default:
                                break;
                        }
                    });

                    logger.debug("product code %s, related code %j", pid, results);
                    next(null, results);
                }
            });
        },
        amazon: ["default", amazon_price.get],
        jd: ["default", jd_price.get],
        tmall: ["default", tmall_price.get]
    }, function (error, results) {
        if (error) {
            logger.error("%o", error);
            callback(new Error());
        } else {
            var value = {
                pid: params.pid,
                allusetime: ((new Date()) - begintime),
                usetime: {
                    jd: results.jd.usetime,
                    tmall: results.tmall.usetime,
                    amazon: results.amazon.usetime
                },
                code: {
                    jd: results.default.jd,
                    tmall: results.default.tmall,
                    amazon: results.default.amazon
                },
                price: {
                    jd: results.jd.price,
                    tmall: results.tmall.price,
                    amazon: results.amazon.price
                }
            };

            logger.debug(value);
            callback(null, value);
        }
    });
};

module.exports.record = function (callback, params) {
    module.exports.get(function (error, results) {
        if (error) {
            logger.error("%o", error);
            callback(new Error());
        } else {
            ProductPrice.create([
                {
                    pid: results.pid,
                    source: DICT_PRODUCT_SOURCE.jd,
                    code: results.code.jd,
                    price: results.price.jd,
                    usetime: results.usetime.jd,
                    datetime: new Date(),
                    creator: USER_SYSTEM
                }, {
                    pid: results.pid,
                    source: DICT_PRODUCT_SOURCE.tmall,
                    code: results.code.tmall,
                    price: results.price.tmall,
                    usetime: results.usetime.tmall,
                    datetime: new Date(),
                    creator: USER_SYSTEM
                }, {
                    pid: results.pid,
                    source: DICT_PRODUCT_SOURCE.amazon,
                    code: results.code.amazon,
                    price: results.price.amazon,
                    usetime: results.usetime.amazon,
                    datetime: new Date(),
                    creator: USER_SYSTEM
                }
            ]);

            callback(null, results);
        }
    }, { pid: params.pid });
};
module.exports.recordAll = function (callback, params) {
    var query = Product.find();
    query.exec(function (error, products) {
        if (error) {
            logger.error("%o", error);
            callback(new Error());
        } else {
            async.eachSeries(products, function (item, next) {
                module.exports.record(function (error, results) {
                    if (error) {
                        next(new Error(error));
                    } else {
                        next(null);
                    }
                }, { pid: item.id });
            }, function (error, results) {
                if (error) {
                    logger.error("%o", error);
                }

                callback(null, null);
            });
        }
    });
};
