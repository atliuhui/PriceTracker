var express = require('express');

var product_price = require('../controllers/product_price.js');

var router = express.Router();

router.get('/', function (req, res, next) {
});
router.get('/:code/price', function (req, res, next) {
    product_price.get(function (error, results) {
        if (error) {
            next(new Error(error));
        } else {
            res.render('product', {
                data: results
            });
        }
    }, { code: req.param("code") });
});

module.exports = router;
