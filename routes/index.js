var express = require('express');
var request = require("request");
var cheerio = require('cheerio');
var router = express.Router();

router.get('/', function (req, res, next) {
    request({
        uri: "http://item.jd.hk/1952025209.html",
        method: "GET",
        encoding: "gzip",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var $ = cheerio.load(body);
            var title = $("title").text().trim();
            var price = $("#jd-price").html();
            res.render('index', {
                data: body
            });
        }
    });
});

module.exports = router;
