var express = require('express');
var expresshandlebars = require('express-handlebars');
var path = require('path');

var helperException = require('./helpers/exception');
var helperHandlebars = require('./helpers/handlebars');

var routerIndex = require('./routes/index');
// var routerStory = require('./routes/story');
// var routerVenue = require('./routes/venue');
// var routerPerson = require('./routes/person');

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
// app.use('/story', routerStory);
// app.use('/venue', routerVenue);
// app.use('/person', routerPerson);

app.use(helperException.notfound);
app.use(helperException.error);

module.exports = app;