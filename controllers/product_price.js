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

            console.log("product code %s, link code %o", code, results);
            next(null, results);
        },
        get_amazon_price: ["default", amazon_price.get],
        get_jd_price: ["default", jd_price.get],
        get_tmall_price: ["default", tmall_price.get]
    }, function (error, results) {
        var s2 = new Date();

        callback(error, {
            usetime: (s2 - s1),
            amazon_price: results.get_amazon_price.price,
            jd_price: results.get_jd_price.price,
            tmall_price: results.get_tmall_price.price
        });
    });
};
