var express = require('express');
var router = express.Router();
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var subpath = express();

router.route.use(express.static('dist'));
router.route.use("/v1", subpath);
swagger.setAppHandler(subpath);
swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});
subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0'); 