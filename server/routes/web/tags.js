const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const proxy = require('../../conf/proxy-conf');
const utils = require('../../util/utils');
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** GET ALL TAGS */
router.get('/tags', function (req, res, next) {
    logger.debug('Servicio: Listado de tags');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.TAGS_LIST;
    let serviceRequestUrl = serviceBaseUrl + serviceName;
    console.log(req.query.q);
    if (req.query.q) {
        serviceRequestUrl += '?q=' + req.query.q;
    }
    logger.notice('URL de petición: ' + serviceRequestUrl);

    //Proxy checking
    let httpConf = null;
    if (constants.REQUESTS_NEED_PROXY == true) {
        logger.warning('Realizando petición a través de proxy');
        let httpProxyConf = proxy.getproxyOptions(serviceRequestUrl);
        httpConf = httpProxyConf;
    } else {
        httpConf = serviceRequestUrl;
    }

    http.get(httpConf, function (results) {
        var body = '';
        results.on('error', function () {
            body = {
                status: constants.REQUEST_ERROR_STATUS_500,
                message: 'Error in request'
            };
            res.json(errorBody);
        });
        results.on('data', function (chunk) {
            body += chunk;
        });
        results.on('end', function () {
            res.json(body);
        });
    });
});

module.exports = router;