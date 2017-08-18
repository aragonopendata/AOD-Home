var express = require("express");
var router = express.Router();
const http = require("http");
const constants = require("../constants");


router.get("/datasets/page/:page/rows/:row", function(req, res, next) {

    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    let params = '?rows=' + req.params.row + '&start=' + (req.params.page * 20);

    mypath = curl + met + params;
    
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