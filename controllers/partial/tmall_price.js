var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');

module.exports.get = function (callback, results) {
    if (results && results.default && results.default.tmall) {
        request({
            uri: "http://detail.tmall.com/item.htm?id={TMALLCODE}".replace(/{TMALLCODE}/g, results.default.tmall),
            method: "GET",
            encoding: null,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if (error) {
                callback(new Error(error));
            } else if (response.statusCode != 200) {
                callback(new Error("[tmall_price_get]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
            } else {
                var content = iconv.decode(body, 'GBK');
                // var $ = cheerio.load(content);
                // var title = $("#detail .tb-detail-hd > h1").text().trim();
                var price = JSON.parse("{{kv}}".replace(/{kv}/g, content.match(/"reservePrice":"[0-9\.\,]+"/gim))).reservePrice;

                console.log("get tmall price, %s, %f", results.default.tmall, price);
                callback(null, { price: price });
            }
        });
    } else {
        callback(null, { price: null });
    }
}