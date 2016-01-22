var product = require('./controllers/product');

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');
// mongoose.connection.on('open', function () {
//     console.log('%j', mongoose.connection.collection);
//     // mongoose.connection.db.collectionNames(function (error, names) {
//     //     console.log(names);
//     //     mongoose.disconnect();
//     // });
//     // mongoose.disconnect();
// });
// var Schema = mongoose.Schema;
// var pS = new Schema({
//     name: String
// }, { collection: 'prod' });
// var P = mongoose.model('P', pS);
// var newP = new P({
//     name: '1'
// });
// newP.save(function (error, doc) {
//     console.log('%j', doc);
// });

// mongoose.disconnect();

// var log4js = require('log4js');

// log4js.configure({
//     appenders: [
//         {
//             type: 'console'
//         }, {
//             type: 'dateFile',
//             filename: 'logs/',
//             pattern: 'yyyyMMddhh.log',//yyyyMMddhhmmss
//             alwaysIncludePattern: true
//         }
//     ],
//     replaceConsole: true
// });

// var logger = log4js.getLogger('normal');

// for (var i = 0; i < 10000; i++) {
//     logger.info('get amazon price, %s, %d', 'results.default.amazon', 100);
//     logger.trace('Entering cheese testing');
//     logger.debug('Got cheese.');
//     logger.info('Cheese is Gouda.');
//     logger.warn('Cheese is quite smelly.');
//     logger.error('Cheese is too ripe!');
//     logger.fatal('Cheese was breeding ground for listeria.');
// }

// product.getProductPrice(function (error, results) {
//     var a = results;
// }, { pid: '566e32b7b642d69c074e23b3' });

var aaa = function() {};
try {
    var a;
    a.setSeconds(0);
    console.log('%s', a);
} catch (error) {
    console.log('%s', '2');
}
console.log('%s', '3');
