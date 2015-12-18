var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var logger = require('../../helpers/logging').getLogger('price-amazon');

module.exports.get = function (callback, results) {
    if (results && results.default && results.default.amazon) {
        request({
            // uri:util.format('http://amazon.cn/dp/%s.html',results.default.amazon),
            uri: util.format('http://amazon.cn/gp/product/%s', results.default.amazon),
            method: 'GET',
            encoding: null,
            time: true,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if (error) {
                callback(new Error(error));
            } else if (response.statusCode != 200) {
                callback(new Error(util.format('[amazon_price_get]response.statusCode: %d', response.statusCode)));
            } else {
                var content = iconv.decode(body, 'UTF8');
                var $ = cheerio.load(content);
                // var title = $('#productTitle').text().trim();
                var price = $('#priceblock_ourprice').text().replace(/￥/g, '').trim();

                logger.debug('get amazon price, %s, %d', results.default.amazon, price);
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