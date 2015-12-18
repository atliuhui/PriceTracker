var logger = require('./helpers/logging').getLogger('dbclean');

var Product = require('./models/product').Product;
var ProductTracker = require('./models/product').ProductTracker;
var ProductPrice = require('./models/product').ProductPrice;

logger.info('clean ready');

// ProductPrice.remove({}, function (error) {
//     logger.info('clean Product Price');
// });
ProductTracker.remove({}, function (error) {
    logger.info('clean Product Tracker success');
});
Product.remove({}, function (error) {
    logger.info('clean Product success');
});
