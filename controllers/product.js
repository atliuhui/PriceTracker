var _ = require('underscore')._;
var async = require('async');

var logger = require('../helpers/logging').getLogger('price');

var Product = require('../models/product').Product;
var ProductTracker = require('../models/product').ProductTracker;
var ProductPrice = require('../models/product').ProductPrice;

var amazon_price = require('./partial/amazon_price.js');
var jd_price = require('./partial/jd_price.js');
var tmall_price = require('./partial/tmall_price.js');
var product_price = require('./partial/product_price.js');

var DICT_PRODUCT_SOURCE = require('../helpers/global').DICT_PRODUCT_SOURCE;
var USER_SYSTEM = require('../helpers/global').USER_SYSTEM;
var DICT_CODE = require('../helpers/global').DICT_CODE;

module.exports.index = function (callback, params) {
    Product.findAll(function (error, results) {
        if (error) {
            logger.error('[CODE]310: ', error);
            callback(new Error('310'));
        } else {
            callback(null, { items: results });
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
            logger.error('[CODE]311: ', error);
            callback(new Error('311'));
        } else {
            var value = {
                product: results.product,
                jd: results.jd,
                tmall: results.tmall,
                amazon: results.amazon,
                allusetime: ((new Date()).getTime() - begintime.getTime())
            };

            callback(null, value);
        }
    });
};

module.exports.getPrice = function (callback, params) {
    ProductPrice.findByPId(params.pid, function (error, prices) {
        if (error) {
            logger.error('[CODE]312: ', error);
            callback(new Error('312'));
        } else {
            callback(null, prices);
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
                next(error);
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
                        next(error2);
                    } else {
                        product_price.recordProductPrice(function (error3, results) {
                            if (error3) {
                                next(error3);
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
            logger.error('[CODE]313: ', error);
            callback(new Error('313'));
        } else {
            callback(null, { code: DICT_CODE['210'] });
        }
    });
};
module.exports.testPrice = function (callback, params) {
    async.each(params.data, function(item, next) {
        product_price.loadProductPrice(function (error, results) {
            if (error) {
                next(error);
            } else {
                next(null);
            }
        }, { pid: params.pid, key: {jd: item.jd_key, tmall: item.tmall_key, amazon: item.amazon_key} });
    }, function (error) {
        if (error) {
            logger.error('[CODE]314: ', error);
            callback(new Error('314'));
        } else {
            callback(null, { code: DICT_CODE['210'] });
        }
    });
};

module.exports.recordAllProductPrice = function (callback, params) {
    Product.findAll(function (error, products) {
        if (error) {
            logger.error('[CODE]380: ', error);
            callback(new Error('380'));
        } else {
            async.eachSeries(products, function (item, next) {
                product_price.recordProductPrice(function (error, results) {
                    if (error) {
                        next(error);
                    } else {
                        next(null);
                    }
                }, { pid: item.id });
            }, function (error, results) {
                if (error) {
                    logger.error('[CODE]381: ', error);
                    callback(new Error('381'));
                } else {
                    callback(null, null);
                }
            });
        }
    });
};
