var util = require("util");
var request = require("request");
var cheerio = require("cheerio");
var iconv = require("iconv-lite");

module.exports.get = function (callback, results) {
    if (results && results.default && results.default.tmall) {
        request({
            uri: util.format("http://detail.tmall.com/item.htm?id=%s", results.default.tmall),
            method: "GET",
            encoding: null,
            time: true,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if (error) {
                callback(new Error(error));
            } else if (response.statusCode != 200) {
                callback(new Error(util.format("[tmall_price_get]response.statusCode: %d", response.statusCode)));
            } else {
                var content = iconv.decode(body, "GBK");
                // var $ = cheerio.load(content);
                // var title = $("#detail .tb-detail-hd > h1").text().trim();
                // var price = JSON.parse("{{kv}}".replace(/{kv}/g, content.match(/"reservePrice":"[0-9\.\,]+"/gim))).reservePrice;
                var price = JSON.parse(util.format("{%s}", content.match(/"reservePrice":"[0-9\.\,]+"/gim))).reservePrice;

                console.log("get tmall price, %s, %d", results.default.tmall, price);
                callback(null, {
                    usetime: response.elapsedTime,
                    price: price
                });
            }
        });
    } else {
        callback(null, { price: null });
    }
}