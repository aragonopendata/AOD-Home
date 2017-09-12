var express = require("express");
var router = express.Router();
const url = require('url');
const http = require("http");
const constants = require("../constants");
    
router.get("/", function(req, res, next) {

    let curl = constants.URL;
    let met = constants.GET_ORGS;
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

router.get("/:org", function(req, res, next) {
    
    let curl = constants.URL;
    let met = constants.GET_ORG_DETAIL;
    let params = '?id=' + req.params.org;
    var mypath = curl + met + params;
    
    //Header options to send API_KEY
    var getOptions = {
        host: constants.HOSTNAME,
        port: constants.PORT,
        path: '/datos/api/action/organization_show?id=' + req.params.org,
        headers: {
            'Authorization': 'XXXX'
        }
    };

    http.get(getOptions, function (result) {
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