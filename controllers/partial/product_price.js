var _ = require('underscore')._;
var async = require('async');

var logger = require('../../helpers/logging').getLogger('product_price');

var ProductTracker = require('../../models/product').ProductTracker;
var ProductPrice = require('../../models/product').ProductPrice;

var amazon_price = require('./amazon_price.js');
var jd_price = require('./jd_price.js');
var tmall_price = require('./tmall_price.js');

var DICT_PRODUCT_SOURCE = require('../../helpers/global').DICT_PRODUCT_SOURCE;
var USER_SYSTEM = require('../../helpers/global').USER_SYSTEM;

module.exports.loadProductPrice = function (callback, params) {
    var begintime = new Date();
    async.auto({
        default: function (next) {
            if(params.key) {
                logger.debug('product related code %j', params.key);
                next(null, params.key);
            } else if (params.pid) {
                ProductTracker.findByPId(params.pid, function (error, trackers) {
                    if (error) {
                        callback(error);
                    } else {
                        var value = {};

                        _.each(trackers, function (item, index) {
                            switch (item.source) {
                                case DICT_PRODUCT_SOURCE.jd:
                                    value.jd = item.key;
                                    break;
                                case DICT_PRODUCT_SOURCE.tmall:
                                    value.tmall = item.key;
                                    break;
                                case DICT_PRODUCT_SOURCE.amazon:
                                    value.amazon = item.key;
                                    break;
                                default:
                                    break;
                            }
                        });

                        logger.debug('product related code %j', value);
                        next(null, value);
                    }
                });
            } else {
                callback(new Error('loadProductPrice params is null'));
            }
        },
        amazon: ['default', amazon_price.get],
        jd: ['default', jd_price.get],
        tmall: ['default', tmall_price.get]
    }, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var datetime = new Date();
            var value = {
                jd: results.jd,
                tmall: results.tmall,
                amazon: results.amazon,
                allusetime: (datetime.getTime() - begintime.getTime())
            };
            value.jd.key = results.default.jd;
            value.tmall.key = results.default.tmall;
            value.amazon.key = results.default.amazon;
            value.jd.datetime = datetime;
            value.tmall.datetime = datetime;
            value.amazon.datetime = datetime;

            logger.debug('product entity %j', value);
            callback(null, value);
        }
    });
};

module.exports.recordProductPrice = function (callback, params) {
    module.exports.loadProductPrice(function (error, results) {
        if (error) {
            callback(error);
        } else {
            ProductPrice.create([
                {
                    pid: params.pid,
                    source: DICT_PRODUCT_SOURCE.jd,
                    key: results.jd.key,
                    price: results.jd.price,
                    usetime: results.jd.usetime,
                    datetime: results.jd.datetime,
                    creator: USER_SYSTEM
                }, {
                    pid: params.pid,
                    source: DICT_PRODUCT_SOURCE.tmall,
                    key: results.tmall.key,
                    price: results.tmall.price,
                    usetime: results.tmall.usetime,
                    datetime: results.tmall.datetime,
                    creator: USER_SYSTEM
                }, {
                    pid: params.pid,
                    source: DICT_PRODUCT_SOURCE.amazon,
                    key: results.amazon.key,
                    price: results.amazon.price,
                    usetime: results.amazon.usetime,
                    datetime: results.amazon.datetime,
                    creator: USER_SYSTEM
                }
            ], function (error) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, results);
                }
            });
        }
    }, { pid: params.pid });
};