var express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        data: {
            title: '首页',
            poster: '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg'
        }
    });
});

module.exports = router;
