var express = require("express");
var router = express.Router();
const url = require('url');
const http = require("http");
const httpProxy = require('http-proxy-agent');
const constants = require("../constants");


router.get("/", function(req, res, next) {

    let curl = constants.URL;
    let met = constants.GET_TOPICS;
    let params = '?all_fields=true';
    var mypath = curl + met + params;

    http.get(mypath, function (result) {
        var body = '';
        result.on('data', function(chunk) {
            body += chunk;
        });
        result.on('end', function() {
            res.json(body);
        });
    });
});

module.exports = router;