const express = require('express');
const router = express.Router();
const url = require('url');
const http = require('http');
const constants = require('../constants');
const utils = require('../utils/routesUtils');

router.get('/', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    var mypath = curl + met + utils.getParams(req);
    if (req.query.text) {
        mypath += '&q=' + req.query.text;
    }

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

//Dataset search by Topic and/or Type
router.get('/topic/:topicName', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    var mypath = curl + met + utils.getParams(req);
    if (req.params.topicName) {
        mypath += '&fq=groups:' + req.params.topicName;
    }
    if (req.query.type) {
        //TODO TYPES
    }

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

//Dataset search by Organization and/or Type
router.get('/organization/:organizationName', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    var mypath = curl + met + utils.getParams(req);
    if (req.params.organizationName) {
        mypath += '&fq=organization:' + req.params.organizationName;;
    }
    if (req.query.type) {
        //TODO TYPES
    }


    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

//Dataset search by Tags
router.get('/tags', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    var mypath = curl + met + utils.getParams(req) + utils.getTags(req);

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

//New Datasets
router.get('/new', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_NEW_DATASETS;
    var mypath = curl + met;

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

//Most Downloaded Datasets
router.get('/downloaded', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DOWNLOADED_DATASETS;
    var mypath = curl + met;

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

router.get('/name/:name', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS_AUTOCOMPLETE;
    let params = '?q=%' + req.params.name + '%&limit=8';
    var mypath = curl + met + params;

    http.get(mypath,  function  (result) {
        var body = '';
        result.on('data', function (chunk) {
            body += chunk;
        });
        result.on('end', function () {
            res.json(body);
        });
    });
});

router.get('/name/', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS_AUTOCOMPLETE;
    let params = '?q=%%&limit=8';
    var mypath = curl + met + params;

    http.get(mypath,  function  (result) {
        var body = '';
        result.on('data', function (chunk) {
            body += chunk;
        });
        result.on('end', function () {
            res.json(body);
        });
    });
});

//Dataset By Name
router.get('/byname/:name', function (req, res, next) {
    let curl = constants.URL;
    let met = constants.GET_DATASETS;
    var mypath = curl + met + '?fq=name:' + req.params.name;

    http.get(mypath, function (results) {
        var body = '';
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

module.exports = router;