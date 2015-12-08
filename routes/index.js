var express = require('express');
var async = require('async');
// var request = require("request");
// var cheerio = require("cheerio");
// var iconv = require('iconv-lite');
// var Buffer = require('buffer').Buffer;

var amazon_price = require('./partial/amazon_price.js');
var jd_price = require('./partial/jd_price.js');
var tmall_price = require('./partial/tmall_price.js');

var router = express.Router();

router.get('/', function (req, res, next) {
    var s1 = new Date();
    async.auto({
        code: function (callback) {
            var results = {
                amazon: "B002J03PBA",
                jd: "1952025209",
                tmall: "44783214078"
            };

            callback(null, results);
        },
        get_amazon_price: ["code", amazon_price.get],
        get_jd_price: ["code", jd_price.get],
        get_tmall_price: ["code", tmall_price.get]
    }, function (error, results) {
        if (error) {
            next(new Error(error));
        } else {
            var s2 = new Date();
            res.render('index', {
                data: {
                    usetime: (s2 - s1),
                    amazon_price: results.get_amazon_price.price,
                    jd_price: results.get_jd_price.price,
                    tmall_price: results.get_tmall_price.price
                }
            });
        }
    });
});

module.exports = router;
