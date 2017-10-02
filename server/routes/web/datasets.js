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

/** GET DATASETS PAGINATED */
router.get(constants.API_URL_DATASETS, function (req, res, next) {
    logger.debug('Servicio: Listado de datasets paginados');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH;
    let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
    if (req.query.text) {
        serviceRequestUrl += '&q=' + req.query.text;
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

/** GET DATASETS BY AUTOCOMPLETE */
router.get(constants.API_URL_DATASETS_AUTOCOMPLETE, function (req, res, next) {
    logger.debug('Servicio: Obtener nombres de dataset mediante texto autocompletado');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH_AUTOCOMPLETE;
    let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
    if (req.query.text) {
        serviceRequestUrl += '&q=%' + encodeURIComponent(req.query.text) + '%';
    } else {
        serviceRequestUrl += '&q=%%';
    }
    if (req.query.limit) {
        serviceRequestUrl += '&limit=' + req.query.limit;
    } else {
        serviceRequestUrl += '&limit=' + constants.DATASETS_AUTOCOMPLETE_LIMIT;
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

/** GET DATASETS BY TAGS */
router.get(constants.API_URL_DATASETS_TAGS, function (req, res, next) {
    logger.debug('Servicio: Obtener datasets por tags');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH;
    let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req) + utils.getRequestTags(req);
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

/** GET NEWEST DATASETS */
router.get(constants.API_URL_DATASETS_NEWEST, function (req, res, next) {
    logger.debug('Servicio: Obtener datasets recientes');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH_NEWEST;
    let serviceRequestUrl = serviceBaseUrl + serviceName;
    if (req.query.rows) {
        serviceRequestUrl += '&rows=' + req.query.rows;
    } else {
        serviceRequestUrl += '&rows=' + constants.DATASETS_SEARCH_NEWEST_ROWS_LIMIT;
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

/** GET MOST DOWNLOADED DATASETS */
router.get(constants.API_URL_DATASETS_DOWNLOADED, function (req, res, next) {
    logger.debug('Servicio: Obtener datasets por tags');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH_MOST_DOWNLOADED;
    let serviceRequestUrl = serviceBaseUrl + serviceName;
    if (req.query.rows) {
        serviceRequestUrl += '&rows=' + req.query.rows;
    } else {
        serviceRequestUrl += '&rows=' + constants.DATASETS_SEARCH_MOST_DOWNLOADED_ROWS_LIMIT;
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

/** GET NUMBER OF DATASETS AND RESOURCES */
router.get(constants.API_URL_DATASETS_COUNT, function (req, res, next) {
    logger.debug('Servicio: Obtener número de datasets y recursos');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH;
    let serviceRequestUrl = serviceBaseUrl + serviceName + '?rows=0&start=0';

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

/** GET DATASETS BY TOPIC */
router.get(constants.API_URL_DATASETS_TOPIC + '/:topicName', function (req, res, next) {
    logger.debug('Servicio: Listado de datasets por tema');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH;
    logger.notice('Request: ' + req);
    let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
    if (req.params.topicName) {
        serviceRequestUrl += '&fq=groups:' + req.params.topicName;
    }
    if (req.query.type) {
        //TODO TYPES
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

/** GET DATASETS BY ORGANIZATION */
router.get(constants.API_URL_DATASETS_ORGANIZATION + '/:organizationName', function (req, res, next) {
    logger.debug('Servicio: Listado de datasets por organización');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASETS_SEARCH;
    let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
    if (req.params.organizationName) {
        serviceRequestUrl += '&fq=organization:' + req.params.organizationName;
    }
    if (req.query.type) {
        //TODO TYPES
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

/** GET DATASET BY NAME */
router.get(constants.API_URL_DATASETS + '/:datasetName', function (req, res, next) {
    logger.debug('Servicio: Obtener dataset por nombre');
    let serviceBaseUrl = constants.CKAN_API_BASE_URL;
    let serviceName = constants.DATASET_SHOW;
    let serviceRequestUrl = serviceBaseUrl + serviceName + '?id=' + req.params.datasetName;
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

/** GET DATASET HOMER */
router.get('/homer', function (req, res, next) {
    logger.debug('Servicio: Obtener dataset HOMER');
    let serviceBaseUrl = constants.HOMER_API_BASE_URL;
    let serviceRequestUrl = serviceBaseUrl + utils.getRequestHomerCommonParams(req);
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