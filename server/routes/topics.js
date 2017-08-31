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
    
    //PROXY CONFIGURATION
    var proxyConf = process.env.http_proxy || 'http://jbarrio:*$Sorinas17*mix@10.74.255.120:8080/';
    var endpoint = process.argv[2] || mypath;
    var proxyAgent = new httpProxy(proxyConf);
    var options = url.parse(endpoint);
    options.agent = proxyAgent;
    // //////////////////

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