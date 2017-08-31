const express = require('express');
const router = express.Router();
const url = require('url');
const http = require('http');
const httpProxy = require('http-proxy-agent');
const constants = require('../constants');


router.get('/page/:page/rows/:row', function(req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    let params = '?rows=' + req.params.row + '&start=' + (req.params.page * 20);
    var mypath = curl + met + params;

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function(chunk) {
            body += chunk;
        });
        results.on('end', function() {
            res.json(body);
        });
    });
});

router.get('/topic/:topicName/page/:page/rows/:row', function(req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS_BY_TOPIC;
    let params = '?id=' + req.params.topicName + '&rows=' + req.params.row + '&start=' + (req.params.page * 20);
    var mypath = curl + met + params;
    
    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function(chunk) {
            body += chunk;
        });
        results.on('end', function() {
            res.json(body);
        });
    });
});

module.exports = router;