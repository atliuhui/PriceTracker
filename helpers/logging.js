var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console'
        }, {
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'yyyyMMddhh.log',//yyyyMMddhhmmss
            alwaysIncludePattern: true
        }
    ],
    replaceConsole: true
});

module.exports = log4js;
