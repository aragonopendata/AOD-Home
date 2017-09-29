const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const proxy = require('../../conf/proxy-conf');
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** LIST ALL TOPICS */
router.get(constants.API_URL_TOPICS, function (req, res, next) {
    logger.debug('Servicio: Listado de temas');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.TOPICS_LIST;
    let serviceParams = '?all_fields=true';
    let serviceRequestUrl = serviceBaseUrl + serviceName + serviceParams;
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