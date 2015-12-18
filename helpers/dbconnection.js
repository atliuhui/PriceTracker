var util = require('util');
var mongoose = require('mongoose');

var logger = require('./logging').getLogger('dbconnection');

var DB_URI = require('./global').DB_URI;

mongoose.connection.on('connected', function () {
    logger.info('mongoose connection success');
});

mongoose.connection.on('close', function () {
    mongoose.connect(DB_URI, { server: { auto_reconnect: true } });
    logger.info('mongoose reconnection success');
});

mongoose.connection.on('error', function (error) {
    logger.error('mongoose connection error: ', error);
});

mongoose.connection.on('disconnected', function () {
    logger.info('mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info('mongoose disconnected through service termination');
        process.exit(0);
    });
});

mongoose.connect(DB_URI, { server: { auto_reconnect: true } });
logger.info('creating global mongoose connection');

module.exports.mongoose = mongoose;
