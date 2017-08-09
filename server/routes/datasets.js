var express = require("express");
var router = express.Router();
const http = require("http");
const constants = require("../constants");


router.get("/ckanDatasets/:params", function(req, res, next) {

    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    let params = req.params.params;

    mypath = curl + met + params;

    console.log(mypath);
    
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