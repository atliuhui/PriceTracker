var product_price = require('./controllers/product_price');

product_price.get(function (error, results) {
	if (error) {
		console.error(error);
	} else {
		console.info(results);
	}
}, { code: "P001" });