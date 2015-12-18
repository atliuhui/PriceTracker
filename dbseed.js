var util = require('util');

var logger = require('./helpers/logging').getLogger('dbseed');

var USER_SYSTEM = require('./helpers/global').USER_SYSTEM;

var Product = require('./models/product').Product;
var ProductTracker = require('./models/product').ProductTracker;
var ProductPrice = require('./models/product').ProductPrice;

logger.info('seed ready');

Product.create([{
    title: 'BOX',
    creator: USER_SYSTEM
}], function (error) {
    if (error) {
        logger.error('create Product, error: ', error);
    } else {
        logger.info('create Product success');

        var p1 = arguments[1][0];
        ProductTracker.create([
            {
                pid: p1.id,
                source: 'jd',
                url: util.format('http://item.jd.com/%s.html', '1952025209'),
                code: '1952025209',
                creator: USER_SYSTEM
            }, {
                pid: p1.id,
                source: 'tmall',
                url: util.format('http://detail.tmall.com/item.htm?id=%s', '44783214078'),
                code: '44783214078',
                creator: USER_SYSTEM
            }, {
                pid: p1.id,
                source: 'amazon',
                url: util.format('http://amazon.cn/gp/product/%s', 'B002J03PBA'),
                code: 'B002J03PBA',
                creator: USER_SYSTEM
            }
        ], function (error) {
            if (error) {
                logger.error('create Product Tracker, error: ', error);
            } else {
                logger.info('create Product Tracker success');
            }
        });
    }
});
