var express = require('express');
var router = express.Router();
const http = require('http');

router.get('/ckanDatasets', function(req, res, next) {

    mypath = "http://opendata.aragon.es/datos/api/action/package_search";

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