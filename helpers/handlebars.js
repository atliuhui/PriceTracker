var moment = require('moment');

module.exports.json = function (context) {
    return JSON.stringify(context);
};

module.exports.format = function (context, format) {
    return moment(context).format(format);
};