var express = require('express');
var formidable = require('formidable');

var product = require('../controllers/product.js');

var router = express.Router();

router.get('/', function (req, res, next) {
    product.index(function (error, results) {
        if (error) {
            next(error);
        } else {
            results.title = '产品列表';
            results.poster = '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg';
            res.render('product-index', {
                data: results
            });
        }
    });
});
router.get('/import', function (req, res, next) {
    res.render('product-import', {
        data: {
            title: '产品导入',
            poster: '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg'
        }
    });
});
router.post('/import', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        if (error) {
            next(error);
        } else {
            product.importPrice(function (error2, results) {
                if (error2) {
                    next(error2);
                } else {
                    res.render('product-import', {
                        data: {
                            title: '产品导入',
                            poster: '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg',
                            message: results.code.msg
                        }
                    });
                }
            }, {data: JSON.parse(fields.products)});
        }
    });
    // var postdata = null;
    // req.on('data', function(data) {
    //     postdata = decodeURIComponent(data);
    // });
    // req.on('end', function() {
    // });
});
router.get('/test', function (req, res, next) {
    res.render('product-import-test', {
        data: {
            title: '导入测试',
            poster: '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg'
        }
    });
});
router.post('/test', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        if (error) {
            next(error);
        } else {
            product.testPrice(function (error2, results) {
                if (error2) {
                    next(error2);
                } else {
                    res.render('product-import-test', {
                        data: {
                            title: '导入测试',
                            json: fields.products,
                            poster: '/images/FloatingMarket_ZH-CN9326364399_1366x768.jpg',
                            message: results.code.msg
                        }
                    });
                }
            }, {data: JSON.parse(fields.products)});
        }
    });
});
router.get('/:code', function (req, res, next) {
    product.get(function (error, results) {
        if (error) {
            next(error);
        } else {
            results.title = '产品详细';
            results.poster = results.product.poster;
            results.content = results.product.content;
            res.render('product-detail', {
                data: results
            });
        }
    }, { pid: req.param('code') });
});
router.get('/:code/price', function (req, res, next) {
    product.getPrice(function (error, results) {
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
