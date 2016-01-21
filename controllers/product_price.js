var _ = require('underscore')._;
var async = require('async');

var logger = require('../helpers/logging').getLogger('price');

var Product = require('../models/product').Product;
var ProductTracker = require('../models/product').ProductTracker;
var ProductPrice = require('../models/product').ProductPrice;

var amazon_price = require('./partial/amazon_price.js');
var jd_price = require('./partial/jd_price.js');
var tmall_price = require('./partial/tmall_price.js');

var DICT_PRODUCT_SOURCE = require('../helpers/global').DICT_PRODUCT_SOURCE;
var USER_SYSTEM = require('../helpers/global').USER_SYSTEM;
var DICT_CODE = require('../helpers/global').DICT_CODE;

module.exports.index = function (callback, params) {
    Product.findAll(function (error, results) {
        if (error) {
            callback(new Error(error));
        } else {
            callback(null, {items: results});
        }
    });
};
module.exports.get = function (callback, params) {
    var begintime = new Date();
    async.auto({
        product: function (next) {
            Product.findByPId(params.pid, function (error, results) {
                if (error) {
                    next(new Error(error));
                } else if (results.length !== 1) {
                    next(null, null);
                } else {
                    next(null, results[0]);
                }
            });
        },
        jd: function (next) {
            ProductPrice.getJDLatest(params.pid, function (error, results) {
                if (error) {
                    next(new Error(error));
                } else if (results.length !== 1) {
                    next(null, null);
                } else {
                    next(null, results[0]);
                }
            });
        },
        tmall: function (next) {
            ProductPrice.getTMALLLatest(params.pid, function (error, results) {
                if (error) {
                    next(new Error(error));
                } else if (results.length !== 1) {
                    next(null, null);
                } else {
                    next(null, results[0]);
                }
            });
        },
        amazon: function (next) {
            ProductPrice.getAMAZONLatest(params.pid, function (error, results) {
                if (error) {
                    next(new Error(error));
                } else if (results.length !== 1) {
                    next(null, null);
                } else {
                    next(null, results[0]);
                }
            });
        }
    }, function (error, results) {
        if (error) {
            logger.error('[CODE]317: ', error);
            callback(new Error('317'));
        } else {
            var value = {
                product: results.product,
                jd: results.jd,
                tmall: results.tmall,
                amazon: results.amazon,
                allusetime: ((new Date()).getTime() - begintime.getTime())
            };

            logger.debug(value);
            callback(null, value);
        }
    });
};

module.exports.importPrice = function (callback, params) {
    async.each(params.data, function(item, next) {
        Product.create([
            {
                title: item.title,
                tags: item.tags,
                poster: item.poster,
                content: item.content,
                creator: USER_SYSTEM
            }
        ], function (error) {
            var product = arguments[1][0];
            if (error) {
                logger.error('[CODE]320: ', error);
                next(new Error('320'));
            } else {
                ProductTracker.create([
                    {
                        pid: product.id,
                        source: DICT_PRODUCT_SOURCE.jd,
                        url: item.jd_url,
                        key: item.jd_key,
                        creator: USER_SYSTEM
                    }, {
                        pid: product.id,
                        source: DICT_PRODUCT_SOURCE.tmall,
                        url: item.tmall_url,
                        key: item.tmall_key,
                        creator: USER_SYSTEM
                    }, {
                        pid: product.id,
                        source: DICT_PRODUCT_SOURCE.amazon,
                        url: item.amazon_url,
                        key: item.amazon_key,
                        creator: USER_SYSTEM
                    }
                ], function (error2) {
                    if (error2) {
                        logger.error('[CODE]321: ', error2);
                        next(new Error('321'));
                    } else {
                        module.exports.recordProductPrice(function (error3, results) {
                            if (error3) {
                                next(new Error(error3));
                            } else {
                                next(null);
                            }
                        }, { pid: product.id });
                    }
                });
            }
        });
    }, function (error) {
        if (error) {
            logger.error('[CODE]322: ', error);
            callback(new Error('322'));
        } else {
            callback(null, {code: DICT_CODE['210']});
        }
    });
};

module.exports.getPrice = function (callback, params) {
    ProductPrice.findByPId(params.pid, function (error, prices) {
        if (error) {
            logger.error('[CODE]316: ', error);
            callback(new Error('316'));
        } else {
            callback(null, prices);
        }
    });
};

module.exports.loadProductPrice = function (callback, params) {
    var begintime = new Date();
    async.auto({
        default: function (next) {
            var pid = params.pid;
            ProductTracker.findByPId(pid, function (error, trackers) {
                if (error) {
                    logger.error('[CODE]314: ', error);
                    callback(new Error('314'));
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

                    logger.debug('product code %s, related code %j', pid, value);
                    next(null, value);
                }
            });
        },
        amazon: ['default', amazon_price.get],
        jd: ['default', jd_price.get],
        tmall: ['default', tmall_price.get]
    }, function (error, results) {
        if (error) {
            logger.error('[CODE]315: ', error);
            callback(new Error('315'));
        } else {
            var datetime = new Date();
            var value = {
                product: {
                    pid: params.pid
                },
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

            logger.debug(value);
            callback(null, value);
        }
    });
};

module.exports.recordProductPrice = function (callback, params) {
    module.exports.loadProductPrice(function (error, results) {
        if (error) {
            logger.error('[CODE]312: ', error);
            callback(new Error('312'));
        } else {
            ProductPrice.create([
                {
                    pid: results.product.pid,
                    source: DICT_PRODUCT_SOURCE.jd,
                    key: results.jd.key,
                    price: results.jd.price,
                    usetime: results.jd.usetime,
                    datetime: results.jd.datetime,
                    creator: USER_SYSTEM
                }, {
                    pid: results.product.pid,
                    source: DICT_PRODUCT_SOURCE.tmall,
                    key: results.tmall.key,
                    price: results.tmall.price,
                    usetime: results.tmall.usetime,
                    datetime: results.tmall.datetime,
                    creator: USER_SYSTEM
                }, {
                    pid: results.product.pid,
                    source: DICT_PRODUCT_SOURCE.amazon,
                    key: results.amazon.key,
                    price: results.amazon.price,
                    usetime: results.amazon.usetime,
                    datetime: results.amazon.datetime,
                    creator: USER_SYSTEM
                }
            ], function (error) {
                if (error) {
                    logger.error('[CODE]313: ', error);
                    callback(new Error('313'));
                } else {
                    callback(null, results);
                }
            });
        }
    }, { pid: params.pid });
};
module.exports.recordAllProductPrice = function (callback, params) {
    Product.findAll(function (error, products) {
        if (error) {
            logger.error('[CODE]310: ', error);
            callback(new Error('310'));
        } else {
            async.eachSeries(products, function (item, next) {
                module.exports.recordProductPrice(function (error, results) {
                    if (error) {
                        next(new Error(error));
                    } else {
                        next(null);
                    }
                }, { pid: item.id });
            }, function (error, results) {
                if (error) {
                    logger.error('[CODE]311: ', error);
                    callback(new Error('311'));
                } else {
                    callback(null, null);
                }
            });
        }
    });
};
