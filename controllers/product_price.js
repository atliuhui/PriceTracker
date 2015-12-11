// var _ = require("underscore")._;
var async = require('async');

var amazon_price = require('./partial/amazon_price.js');
var jd_price = require('./partial/jd_price.js');
var tmall_price = require('./partial/tmall_price.js');

module.exports.get = function (callback, params) {
    var s1 = new Date();

    async.auto({
        default: function (next) {
            var code = params.code;

            var results = {
                amazon: "B002J03PBA",
                jd: "1952025209",
                tmall: "44783214078"
            };

            console.log("product code %s, related code %j", code, results);
            next(null, results);
        },
        amazon: ["default", amazon_price.get],
        jd: ["default", jd_price.get],
        tmall: ["default", tmall_price.get]
    }, function (error, results) {
        if (error) {
            console.error(error);
            callback(new Error(error));
        } else {
            var value = {
                usetime: ((new Date()) - s1),
                price: {
                    amazon: results.amazon.price,
                    jd: results.jd.price,
                    tmall: results.tmall.price
                }
            };

            console.info(value);
            callback(null, value);
        }
    });
};

module.exports.record = function (callback, params) {
    module.exports.get(function (error, results) {
        callback(error, results);
    }, { code: params.code });
};
module.exports.recordAll = function (callback, params) {
    var arr = ["P001", "P002", "P003", "P004", "P005"];
    // var arr = ["P001", "P002"];

    async.eachSeries(arr, function (item, next) {
        module.exports.record(function (error, results) {
            if (error) {
                next(error);
            } else {
                next(null);
            }
        }, { code: item });
    }, function (error, results) {
        if (error) {
            console.error(error);
        }

        callback(null, null);
    });
};
