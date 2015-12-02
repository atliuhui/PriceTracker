var express = require('express');
var request = require("request");
var async = require('async');
var cheerio = require("cheerio");
// var Buffer = require('buffer').Buffer;
var iconv = require('iconv-lite');

var router = express.Router();

router.get('/', function (req, res, next) {
    var s = new Date();
    async.auto({
        get_jd_title: function (callback, results) {
            request({
                uri: "http://item.jd.hk/1952025209.html",
                method: "GET",
                encoding: null,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                if (error) {
                    callback(new Error(error));
                } else if (response.statusCode != 200) {
                    callback(new Error("[get_jd_title]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
                } else {
                    var content = iconv.decode(body, 'GBK');
                    var $ = cheerio.load(content);
                    var title = $("#name > h1").text().trim();
                    var code = $("#summary-market > span").eq(1).text().trim();

                    callback(null, { title: title, code: code });
                }
            });
        },
        get_jd_price: ["get_jd_title", function (callback, results) {
            request({
                uri: "http://p.3.cn/prices/get?skuid=J_{id}&type=1".replace(/{id}/g, results.get_jd_title.code),
                method: "GET",
                encoding: null,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                if (error) {
                    callback(new Error(error));
                } else if (response.statusCode != 200) {
                    callback(new Error("[get_jd_price]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
                } else {
                    var content = iconv.decode(body, 'UTF8');
                    // var $ = cheerio.load(content);
                    var price = JSON.parse(content);

                    callback(null, price[0].p);
                }
            });
        }],
        get_amazon: function (callback, results) {
            request({
                uri: "http://www.amazon.cn/Thermos-%E8%86%B3%E9%AD%94%E5%B8%88-Funtainer-%E7%B3%BB%E5%88%97%E6%B0%B4%E6%9D%AF12-Ounce-%E8%9D%99%E8%9D%A0%E4%BE%A0/dp/B002J03PBA/ref=lp_813116051_1_1?s=kitchen&ie=UTF8&qid=1449042754&sr=1-1",
                method: "GET",
                encoding: null,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                if (error) {
                    callback(new Error(error));
                } else if (response.statusCode != 200) {
                    callback(new Error("[get_amazon]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
                } else {
                    var content = iconv.decode(body, 'UTF8');
                    var $ = cheerio.load(content);
                    var title = $("#productTitle").text().trim();
                    var price = $("#priceblock_ourprice").text().replace(/￥/g,"").trim();

                    callback(null, { title: title, price: price });
                }
            });
        },
        get_tmall: function (callback, results) {
            request({
                uri: "https://detail.tmall.hk/hk/item.htm?spm=a1z10.4-b.w5003-10660056314.1.hY4c5t&id=44783214078&scene=taobao_shop&sku_properties=5919063:6536025",
                method: "GET",
                encoding: null,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                if (error) {
                    callback(new Error(error));
                } else if (response.statusCode != 200) {
                    callback(new Error("[get_tmall]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
                } else {
                    var content = iconv.decode(body, 'GBK');
                    var $ = cheerio.load(content);
                    var title = $("#detail .tb-detail-hd > h1").text().trim();
                    var kvstring = content.match(/"reservePrice":"[0-9\.\,]+"/gim);
                    var json = JSON.parse("{{kv}}".replace(/{kv}/g, kvstring));

                    callback(null, { title: title, price: json.reservePrice });
                }
            });
        }
    }, function (error, results) {
        if (error) {
            next(new Error(error));
        } else {
            var e = new Date();
            res.render('index', {
                data: {
                    usetime: (e - s),
                    jdtitle: results.get_jd_title.title,
                    jdprice: results.get_jd_price,
                    amazontitle: results.get_amazon.title,
                    amazonprice: results.get_amazon.price,
                    tmalltitle: results.get_tmall.title,
                    tmallprice: results.get_tmall.price
                }
            });
        }
    });
});

module.exports = router;
