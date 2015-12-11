var express = require('express');
// var async = require('async');
// var request = require("request");
// var cheerio = require("cheerio");
// var iconv = require('iconv-lite');
// var Buffer = require('buffer').Buffer;

// var amazon_price = require('./partial/amazon_price.js');
// var jd_price = require('./partial/jd_price.js');
// var tmall_price = require('./partial/tmall_price.js');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        data: {}
    });
});

module.exports = router;
