var util = require('util');
var _ = require('underscore')._;
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var retry = require('retry');

var logger = require('../../helpers/logging').getLogger('price-tmall');

var trycatch = require('../../helpers/trycatch').trycatch;

// module.exports.get = function (callback, params) {
//     if (params && params.default && params.default.tmall) {
//         request({
//             uri: util.format('https://detail.tmall.com/item.htm?id=%s', params.default.tmall.code),
//             method: 'GET',
//             encoding: null,
//             time: true,
//             timeout: 10000,
//             followRedirect: true,
//             maxRedirects: 10
//         }, function (error, response, body) {
//             if (error) {
//                 callback(new Error(error));
//             } else if (response.statusCode != 200) {
//                 callback(new Error(util.format('[tmall_price_get]response.statusCode: %d', response.statusCode)));
//             } else {
//                 var content = iconv.decode(body, 'GBK');

//                 var data = JSON.parse(content.match(/TShop.Setup\([\S\s]*?\)\;/gim)[0].replace('TShop.Setup(', '').replace(');', ''));
//                 var price = data.itemDO.reservePrice;

//                 logger.debug('get tmall price, %j, %d', params.default.tmall, price);
//                 callback(null, {
//                     usetime: response.elapsedTime,
//                     price: price
//                 });
//             }
//         });
//     } else {
//         callback(null, { price: null });
//     }
// };
module.exports.get = function (callback, params) {
    if (params && params.default && params.default.tmall) {
        var operation = retry.operation();
        operation.attempt(function(currentAttempt) {
            request({
                uri: util.format('https://mdskip.taobao.com/core/initItemDetail.htm?itemId=%s', params.default.tmall.code),
                headers: {
                    'referer': util.format('https://detail.tmall.com/item.htm?id=%s', params.default.tmall.code)
                },
                method: 'GET',
                encoding: null,
                time: true,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                if(operation.retry(error)) {
                    logger.debug('get tmall price retry, %j', params.default.tmall);
                    return;
                }
                if (error) {
                    // callback(new Error(error));
                    callback(operation.mainError());
                } else if (response.statusCode != 200) {
                    callback(new Error(util.format('[tmall_price_get]response.statusCode: %d', response.statusCode)));
                } else {
                    var content = iconv.decode(body, 'GBK');
                    // var $ = cheerio.load(content);

                    var price = 0;
                    trycatch(function() {
                        var data = JSON.parse(content);
                        
                        if(params.default.tmall.skuid) {
                            price = data.defaultModel.itemPriceResultDO.priceInfo[params.default.tmall.skuid].price;
                        } else {
                            price = (_.values(data.defaultModel.itemPriceResultDO.priceInfo))[0].price;
                        }
                    }, function() {
                        logger.debug('get tmall price, %j, %d', params.default.tmall, price);
                        callback(null, {
                            usetime: response.elapsedTime,
                            price: price
                        });
                    }, function(error2) {
                        if(operation.retry(error2)) {
                            logger.debug('get tmall price retry, %j', params.default.tmall);
                            return;
                        } else {
                            callback(operation.mainError());
                        }
                    });
                }
            });
        });
    } else {
        callback(null, { price: null });
    }
};