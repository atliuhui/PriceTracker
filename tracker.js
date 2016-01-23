var logger = require('./helpers/logging').getLogger('tracker');

var product = require('./controllers/product');

var nextTime = function () {
	var now = new Date();
	var next = new Date(now);
	// next.setMinutes(now.getMinutes() + 1);
    // next.setDate(now.getDate() + 1);
    next.setHours(now.getHours() + 1);
    next.setMinutes(0);
	next.setSeconds(0);
	next.setMilliseconds(0);

	return {
		now: now,
		next: next,
		delay: (next - now)
	};
};

var timer = function (params) {
	var delay = params.delay || 1;
	setTimeout(processer, delay, timer, params);
};
var processer = function (callback, params) {
	if (params.delay) {
		product.recordAllProductPrice(function (error, results) {
			var time = nextTime();
			logger.info('Now: %s | Next: %s', time.now.toString(), time.next.toString());
			callback({ delay: time.delay });
		});
	} else {
		var time = nextTime();
		logger.info('Now: %s | Next: %s', time.now.toString(), time.next.toString());
		callback({ delay: time.delay });
	}
};

timer({ delay: null });
