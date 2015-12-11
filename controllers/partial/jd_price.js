var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');

module.exports.get = function (callback, results) {
    if (results && results.default && results.default.jd) {
        request({
            // uri: "http://item.jd.com/{JDCODE}.html".replace(/{JDCODE}/g, results.default.jd),
            uri: "http://p.3.cn/prices/get?skuid=J_{JDCODE}".replace(/{JDCODE}/g, results.default.jd),
            method: "GET",
            encoding: null,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if (error) {
                callback(new Error(error));
            } else if (response.statusCode != 200) {
                callback(new Error("[jd_price_get]response.statusCode:{status}".replace(/{status}/g, response.statusCode)));
            } else {
                var content = iconv.decode(body, 'UTF8');
                // var $ = cheerio.load(content);
                var price = JSON.parse(content)[0].p;

                console.log("get jd price, %s, %f", results.default.jd, price);
                callback(null, { price: price });
            }
        });
    } else {
        callback(null, { price: null });
    }
}