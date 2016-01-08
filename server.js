var express = require('express');
var expresshandlebars = require('express-handlebars');
var path = require('path');

var helperException = require('./helpers/exception');
var helperHandlebars = require('./helpers/handlebars');

var routerIndex = require('./routes/index');
var routerProduct = require('./routes/product');

var server = express();
var hbs = expresshandlebars.create({
    defaultLayout: 'main',
    extname: '.html',
    helpers: {
        json: helperHandlebars.json,
        format: helperHandlebars.format
    }
});

server.engine('html', hbs.engine);
server.set('view engine', 'html');

server.use(express.static(path.join(__dirname, 'public')));

server.use('/', routerIndex);
server.use('/product', routerProduct);

server.use(helperException.notfound);
server.use(helperException.error);

server.listen(3000);
