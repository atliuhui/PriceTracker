
module.exports.notfound = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
};

module.exports.error = function (err, req, res, next) {
    console.error(err.stack);

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
            res.send(res.status + ' | ' + err.message + '\n');
        }
    });
};
