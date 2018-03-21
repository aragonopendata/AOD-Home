const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const proxy = require('../../conf/proxy-conf');
const utils = require('../../util/utils');
const querystring = require('querystring');
const request = require('request');
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** GET DATASETS PAGINATED */
router.get(constants.API_URL_DATASETS, function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de datasets paginados');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH;
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
        if (req.query.text) {
            let texto_ny = req.query.text.toLocaleLowerCase().split(' ').join('-').split('ñ').join('ny')
                .split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
                .split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u');
            let texto_n = req.query.text.toLocaleLowerCase().split(' ').join('-').split('ñ').join('n')
                .split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
                .split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u');

            logger.info(texto_ny + " " + texto_n);
            serviceRequestUrl += '&q=(name:*'+ encodeURIComponent(texto_n) + '* OR name:*' + encodeURIComponent(texto_ny) 
                + '* OR res_name:*' + encodeURIComponent(texto_n) + '* OR res_name:*' + encodeURIComponent(texto_ny) + '*)';
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS);
    }
});

/** GET DATASETS BY AUTOCOMPLETE */
router.get(constants.API_URL_DATASETS_AUTOCOMPLETE, function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener nombres de dataset mediante texto autocompletado');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH_AUTOCOMPLETE;
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
        if (req.query.text) {
            serviceRequestUrl += '&q=' + encodeURIComponent(req.query.text);
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_AUTOCOMPLETE);
    }
});

/** GET DATASETS BY TAGS */
router.get(constants.API_URL_DATASETS_TAGS, function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener datasets por tags');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH;
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req) + utils.getRequestTags(req.query.tags);
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_TAGS);
    }
});

/** GET NEWEST DATASETS */
router.get(constants.API_URL_DATASETS_NEWEST, function (req, res, next) {
    try {
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_NEWEST);
    }
});

/** GET MOST DOWNLOADED DATASETS */
router.get(constants.API_URL_DATASETS_DOWNLOADED, function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener datasets más descargados');
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_DOWNLOADED);
    }

});

/** GET NUMBER OF DATASETS AND RESOURCES */
router.get(constants.API_URL_DATASETS_COUNT, function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener número de datasets y recursos');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH_COUNT;
        let serviceRequestUrl = serviceBaseUrl + serviceName;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_COUNT);
    }
});

router.get(constants.API_URL_RESOURCES_COUNT, function (req, res, next) {
    try {
        logger.debug('Servicio: Número de Recursos');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.RESOURCES_SEARCH_COUNT;
        let serviceRequestUrl = serviceBaseUrl + serviceName;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_RESOURCES_COUNT);
    }
});

/** GET DATASETS BY TOPIC */
router.get(constants.API_URL_DATASETS_TOPIC + '/:topicName', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de datasets por tema');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_TOPIC);
    }
});

/** GET DATASETS BY ORGANIZATION */
router.get(constants.API_URL_DATASETS_ORGANIZATION + '/:organizationName', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de datasets por organización');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH;
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);
        if (req.params.organizationName) {
            serviceRequestUrl += '&fq=organization:' + req.params.organizationName;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_ORGANIZATION);
    }

});

/** GET DATASET BY NAME */
router.get(constants.API_URL_DATASETS + '/:datasetName', function (req, res, next) {
    try {
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });

        //CKAN TRACKING REGISTERING
        //CKAN doesn't increment the tracking throught API calls
        logger.debug('Tracking datasets...');
        var post_data = querystring.stringify({
            'url': constants.CKAN_URL_PATH_TRACKING_DATASET + req.params.datasetName,
            'type': constants.CKAN_TRACKING_TYPE_PARAM_PAGE
        });
        logger.debug('Param URL:' + post_data);

        var post_option = {
            host: constants.CKAN_BASE_URL,
            port: constants.CKAN_BASE_PORT,
            path: constants.CKAN_URL_PATH_TRACKING,
            method: constants.HTTP_REQUEST_METHOD_POST,
            headers: {
                'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_FORM_URLENCODED,
                'Content-Length': Buffer.byteLength(post_data),
                'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST
            }
        }
        logger.debug('POST Option:' + post_option);

        var post_request = http.request(post_option, function (results) {
            results.setEncoding(constants.HTTP_RESPONSE_DATA_ENCODING);
            results.on('data', function (chunk) {
                logger.debug('Request on data OK');
            });
        }).on('error', function (err) {
            //No hacemos
            logger.debug('Error en tracking:' + err);
        });

        logger.debug('Writing Post');
        post_request.write(post_data);
        logger.debug('Ending Tracking');
        post_request.end();
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS);
    }
});

/** GET DATASET HOMER */
router.get(constants.API_URL_DATASETS_HOMER, function (req, res, next) {
    try {
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_HOMER);
    }
});

/** GET DATASET HOMER BY PACKAGEID */
router.get(constants.API_URL_DATASETS_HOMER + '/:datasetHomerName', function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener dataset homer por identificador');
        let serviceBaseUrl = constants.HOMER_API_BASE_URL;
        let serviceRequestUrl = serviceBaseUrl + '?q=package_id:' + req.params.datasetHomerName + '&wt=json';
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_HOMER);
    }
});

/** GET RDF FILE OF DATASET */
router.get(constants.API_URL_DATASETS_RDF + '/:datasetName', function (req, res, next) {
    try {
        logger.debug('Servicio: Obtener RDF del dataset por nombre');
        let serviceBaseUrl = constants.CKAN_BASE_URL;
        let serviceName = constants.DATASET_RDF_DATASET;
        let serviceRequestUrl = serviceBaseUrl + ':' + constants.CKAN_BASE_PORT + serviceName + '/' + req.params.datasetName + constants.DATASET_RDF_EXTENSION;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_RDF);
    }
});

/** GET DATASETS BY STATS SEARCH  */
router.get(constants.API_URL_DATASETS_STATS_SEARCH + '/:groupName', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de datasets por información estadistica');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_SEARCH;
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req);

        if (req.params.groupName != 'undefined') {
            serviceRequestUrl += '&q=(organization:instituto-aragones-estadistica AND 01_IAEST_Temaestadistico:' + req.params.groupName + '*) ';
        } else {
            serviceRequestUrl += '&q=(organization:instituto-aragones-estadistica) ';
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_STATS_SEARCH);
    }
});

/** GET DATASETS RESOURCE_VIEW */
router.get(constants.API_URL_DATASETS_RESOURCE_VIEW, function (req, res, next) {
    try {

        logger.debug('Servicio: Obtener vistas de los recursos');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.DATASETS_RESOURCE_VIEW;
        let serviceRequestUrl = serviceBaseUrl + serviceName + '?id=' + req.query.resId;

        var query = '';
        let resParams = [];

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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS_RESOURCE_VIEW);
    }
});

module.exports = router;