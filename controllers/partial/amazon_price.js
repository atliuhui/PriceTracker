var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var logger = require('../../helpers/logging').getLogger('price-amazon');

module.exports.get = function (callback, params) {
    if (params && params.default && params.default.amazon) {
        request({
            // uri:util.format('http://amazon.cn/dp/%s.html',params.default.amazon.code),
            uri: util.format('http://www.amazon.cn/gp/product/%s', params.default.amazon.code),
            method: 'GET',
            // encoding: null,
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
                // var content = iconv.decode(body, 'UTF8');
                var $ = cheerio.load(body);
                
                var price = $('#priceblock_ourprice').text().replace(/￥/g, '').replace(/,/g, '').trim()
                    || $('#priceblock_saleprice').text().replace(/￥/g, '').replace(/,/g, '').trim()
                    || 0;

                logger.debug('get amazon price, %j, %d', params.default.amazon, price);
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