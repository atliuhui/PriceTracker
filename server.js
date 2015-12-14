var express = require("express");
var expresshandlebars = require("express-handlebars");
var path = require("path");

var helperException = require("./helpers/exception");
var helperHandlebars = require("./helpers/handlebars");

var routerIndex = require("./routes/index");
var routerProduct = require("./routes/product");

var server = express();
var hbs = expresshandlebars.create({
	defaultLayout: "main",
	helpers: {
        json: helperHandlebars.json
    }
});

server.engine("handlebars", hbs.engine);
server.set("view engine", "handlebars");

server.use(express.static(path.join(__dirname, "public")));

server.use("/", routerIndex);
server.use("/product", routerProduct);

server.use(helperException.notfound);
server.use(helperException.error);

server.listen(3000);
