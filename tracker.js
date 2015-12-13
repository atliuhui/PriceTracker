var product_price = require("./controllers/product_price");

var nexttime = function () {
	var now = new Date();
	var next = new Date(now);
	next.setMinutes(now.getMinutes() + 1);
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
		product_price.recordAll(function (error, results) {
			var time = nexttime();
			console.info("Now: %s | Next: %s", time.now.toString(), time.next.toString());
			callback({ delay: time.delay });
		});
	} else {
		var time = nexttime();
		console.info("Now: %s | Next: %s", time.now.toString(), time.next.toString());
		callback({ delay: time.delay });
	}
};

timer({ delay: null });
