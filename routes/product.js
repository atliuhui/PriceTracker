var express = require('express');

var product_price = require('../controllers/product_price.js');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        data: {}
    });
});
router.get('/:code/price', function (req, res, next) {
    product_price.getProductPrice(function (error, results) {
        if (error) {
            next(error);
        } else {
            results.title = '产品详细';
            results.poster = results.product.poster;
            results.content = results.product.content;
            res.render('product', {
                data: results
            });
        }
    }, { pid: req.param('code') });
});
router.get('/:code/history', function (req, res, next) {
    product_price.getProductPriceHistory(function (error, results) {
        if (error) {
            next(error);
        } else {
            res.format({
                json: function () {
                    res.json(res.status, results);
                }
            });
        }
    }, { pid: req.param('code') });
});

module.exports = router;
