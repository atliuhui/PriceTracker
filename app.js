var express = require('express');
var expresshandlebars = require('express-handlebars');
var path = require('path');

var helperException = require('./helpers/exception');
var helperHandlebars = require('./helpers/handlebars');

var routerIndex = require('./routes/index');
var routerProduct = require('./routes/product');

var app = express();
var hbs = expresshandlebars.create({
	defaultLayout: 'main',
	helpers: {
        json: helperHandlebars.json
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routerIndex);
app.use('/product', routerProduct);

app.use(helperException.notfound);
app.use(helperException.error);

module.exports = app;