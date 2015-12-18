var util = require('util');

var logger = require('./logging').getLogger('exception');

module.exports.notfound = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
};

module.exports.error = function (err, req, res, next) {
    logger.trace(err.stack);

    res.status(err.status || 500).format({
        html: function () {
            res.render('error', {
                message: err.message,
                status: res.statusCode
            });
        },
        json: function () {
            res.json(res.status, {
                message: err.message,
                status: res.status
            });
        },
        jsonp: function () {
            res.jsonp(res.status, {
                message: err.message,
                status: res.status
            });
        },
        text: function () {
            res.send(util.format('%s | %s\n',res.status, err.message));
        }
    });
};
