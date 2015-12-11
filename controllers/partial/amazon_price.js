var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');

module.exports.get = function (callback, results) {
    if (results && results.default && results.default.amazon) {
        request({
            // uri: "http://amazon.cn/dp/{ASIN}.html".replace(/{ASIN}/g, results.default.amazon),
            uri: "http://amazon.cn/gp/product/{ASIN}".replace(/{ASIN}/g, results.default.amazon),
            method: "GET",
            encoding: null,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if (error) {
                callback(new Error(error));
            } else if (response.statusCode != 200) {
                callback(new Error("[amazon_price_get]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
            } else {
                var content = iconv.decode(body, 'UTF8');
                var $ = cheerio.load(content);
                // var title = $("#productTitle").text().trim();
                var price = $("#priceblock_ourprice").text().replace(/￥/g, "").trim();

                console.log("get amazon price, %s, %f", results.default.amazon, price);
                callback(null, { price: price });
            }
        });
    } else {
        callback(null, { price: null });
    }
}