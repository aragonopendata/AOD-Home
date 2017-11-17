const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const constants = require('../../util/constants');
const utils = require('../../util/utils');
const dbQueries = require('../../db/db-queries');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
const request = require('request');
//Multer for receive form-data
const multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
// FormData for send form-data
const formData = require('form-data');
const fs = require('fs');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
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
        let serviceRequestUrl = serviceBaseUrl + serviceName + utils.getRequestCommonParams(req) + utils.getRequestOrgs(req);;
        if (req.query.text) {
            serviceRequestUrl += '&q=' + encodeURIComponent(req.query.text);
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
        console.log(error);
        logger.error('Error in route' + constants.API_URL_DATASETS);
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
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_DATASETS);
    }
});

/** CREATE DATASET */
router.post('/dataset', function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset que llega desde request: ' + JSON.stringify(dataset));
        //0. CHECKING REQUEST PARAMETERS
        if (dataset.requestUserId != '' && dataset.requestUserName != '' && dataset.name != ''&& dataset.private != undefined) {
            var requestUserId = dataset.requestUserId;
            var requestUserName = dataset.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. INSERTING USER IN CKAN
                    insertDatasetInCkan(accessInfo, dataset)
                        .then(insertCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                            if (insertCkanResponse && insertCkanResponse != null && insertCkanResponse.success) {
                                logger.info('Dataset insertado ' + insertCkanResponse.result.name);
                                var successJson = { 
                                    'status': constants.REQUEST_REQUEST_OK, 
                                    'success': true,
                                    'result':'INSERCCIÓN DE DATASETS - Dataset insertado correctamente'
                                };
                                res.json(successJson);
                            } else {
                                logger.error('INSERCCIÓN DE DATASETS - Error al insertar al dataset en CKAN: ' + JSON.stringify(insertCkanResponse));
                                var errorJson = { 
                                    'status': constants.REQUEST_ERROR_BAD_DATA, 
                                    'error': 'INSERCCIÓN DE DATASETS - Error al insertar al dataset en CKAN',
                                };
                                if (insertCkanResponse && insertCkanResponse != null 
                                        && insertCkanResponse.error && insertCkanResponse.error != null 
                                        && insertCkanResponse.error.name && insertCkanResponse.error.name != null) {
                                    errorJson.message = insertCkanResponse.error.name;
                                }
                                res.json(errorJson);
                                return;
                            }
                        }).catch(error => {
                            logger.error('INSERCCIÓN DE DATASETS - Respuesta del servidor errónea: ' + error);
                            if (error == '409 - "Conflict"') {
                                res.json({ 'status': constants.REQUEST_ERROR_CONFLICT, 'error': 'INSERCCIÓN DE DATASETS - Conflicto al crear dataset, nombre del dataset en uso.', 
                                            'errorTitle': 'Error al crear Dataset', 'errorDetail': 'Nombre del dataset en uso'});
                            } else {
                                res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'INSERCCIÓN DE DATASETS - Respuesta del servidor errónea' });
                            }
                            return;
                        });
                }).catch(error => {
                    logger.error('INSERCCIÓN DE DATASETS - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'INSERCCIÓN DE DATASETS - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('INSERCCIÓN DE DATASETS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'INSERCCIÓN DE DATASETS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('INSERCCIÓN DE DATASETS - Error creando dataset');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'INSERCCIÓN DE DATASETS - Error creando dataset' });
    }
});

/** UPDATE DATASET */
router.put('/dataset', function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset que llega desde request: ' + JSON.stringify(dataset));
        //0. CHECKING REQUEST PARAMETERS
        if (dataset.requestUserId != '' && dataset.requestUserName != '' && dataset.name != ''&& dataset.private != undefined) {
            var requestUserId = dataset.requestUserId;
            var requestUserName = dataset.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. INSERTING USER IN CKAN
                    updateDatasetInCkan(accessInfo, dataset)
                        .then(insertCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                            if (insertCkanResponse && insertCkanResponse != null && insertCkanResponse.success) {
                                logger.info('Dataset insertado ' + insertCkanResponse.result.name);
                                var successJson = { 
                                    'status': constants.REQUEST_REQUEST_OK, 
                                    'success': true,
                                    'result':'ACTUALIZACIÓN DE DATASETS - Dataset actualizado correctamente'
                                };
                                res.json(successJson);
                            } else {
                                logger.error('ACTUALIZACIÓN DE DATASETS - Error al insertar al dataset en CKAN: ' + JSON.stringify(insertCkanResponse));
                                var errorJson = { 
                                    'status': constants.REQUEST_ERROR_BAD_DATA, 
                                    'error': 'ACTUALIZACIÓN DE DATASETS - Error al insertar al dataset en CKAN',
                                };
                                if (insertCkanResponse && insertCkanResponse != null 
                                        && insertCkanResponse.error && insertCkanResponse.error != null 
                                        && insertCkanResponse.error.name && insertCkanResponse.error.name != null) {
                                    errorJson.message = insertCkanResponse.error.name;
                                }
                                res.json(errorJson);
                                return;
                            }
                        }).catch(error => {
                            console.log(error);
                            logger.error('ACTUALIZACIÓN DE DATASETS - Respuesta del servidor errónea: ' + error);
                            if (error == '409 - "Conflict"') {
                                res.json({ 'status': constants.REQUEST_ERROR_CONFLICT, 'error': 'ACTUALIZACIÓN DE DATASETS - Conflicto al actualizar dataset, conflicto en algun parametro.', 
                                            'errorTitle': 'Error al crear Dataset', 'errorDetail': 'Conflicto en algun parametro.'});
                            } else {
                                res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE DATASETS - Respuesta del servidor errónea' });
                            }
                            return;
                        });
                }).catch(error => {
                    logger.error('ACTUALIZACIÓN DE DATASETS - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ACTUALIZACIÓN DE DATASETS - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('ACTUALIZACIÓN DE DATASETS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE DATASETS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('ACTUALIZACIÓN DE DATASETS - Error creando dataset');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE DATASETS - Error actualizando dataset' });
    }
});

/** DELETE DATASET */
router.delete('/dataset', function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset a borrar: ' + JSON.stringify(dataset.name));
        //0. CHECKING REQUEST PARAMETERS
        if(dataset.requestUserId != '' && dataset.requestUserName != '' && dataset.name != ''){
            var requestUserId = dataset.requestUserId;
            var requestUserName = dataset.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    if (accessInfo != undefined){
                        logger.info('Permiso recuperado para usuario ' + requestUserName);
                        //2. DELETING DATASET IN CKAN
                        deleteDatasetInCKAN(accessInfo, dataset.name)
                            .then(deleteCkanResponse => {
                                if (deleteCkanResponse.success) {
                                    logger.info('Dataset borrado correctamente');
                                    var successJson = { 
                                        'status': constants.REQUEST_REQUEST_OK, 
                                        'success': true,
                                        'result':'BORRADO DE DATASETS - Dataset borrado correctamente'
                                    };
                                    res.json(successJson);
                                }else{
                                  
                                    logger.error('BORRADO DE DATASETS - Error al borrar el dataset en CKAN: ' + JSON.stringify(deleteCkanResponse));
                                    var errorJson = { 
                                        'status': constants.REQUEST_ERROR_BAD_DATA, 
                                        'error': 'INSERCCIÓN DE DATASETS - Error al borrar el dataset en CKAN',
                                    };
                                    if (deleteCkanResponse && deleteCkanResponse != null 
                                            && deleteCkanResponse.error && deleteCkanResponse.error != null 
                                            && deleteCkanResponse.error.name && deleteCkanResponse.error.name != null) {
                                        errorJson.message = deleteCkanResponse.error.name;
                                    }
                                    res.json(errorJson);
                                    return;
                                }
                            }).catch(error => {
                                console.log(error);
                                logger.error('BORRADO DE DATASETS - Respuesta del servidor errónea: ' + error);
                                res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE DATASETS - Respuesta del servidor errónea' });
                                return;
                            });
                    } else {
                        logger.error('BORRADO DE DATASETS - Usuario no autorizado: ', error);
                        res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE DATASETS - Usuario no autorizado' });
                    }
                }).catch(error => {
                    logger.error('BORRADO DE DATASETS - Error al obtener la información del usuario: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE DATASETS - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('BORRADO DE DATASETS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE DATASETS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('INSERCCIÓN DE DATASETS - Error borrando dataset');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'INSERCCIÓN DE DATASETS - Error borrando dataset' });
    }
});

/** CREATE RESOURCE */
router.post('/resource', upload.single('file'), function (req, res, next) {
        console.log(req);
        var resource = req.body;
        var requestUserId = resource.requestUserId;
        var requestUserName = resource.requestUserName;
        //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
        getUserPermissions(requestUserId, requestUserName)
        .then(accessInfo => {
            if (accessInfo != undefined){
                logger.info('Permiso recuperado para usuario ' + requestUserName);
                //2. ADD RESOURCE IN CKAN
                insertResourceInCKAN(accessInfo, req)
                .then( insertCkanResponse => {
                    res.json(JSON.parse(insertCkanResponse));
                });
             
            } else {
                logger.error('BORRADO DE DATASETS - Usuario no autorizado: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE DATASETS - Usuario no autorizado' });
            }
        }).catch(error => {
            logger.error('BORRADO DE DATASETS - Error al obtener la información del usuario: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE DATASETS - Usuario no autorizado' });
            return;
        });
  })

/** DELETE RESOURCE */
router.delete('/resource', function (req, res, next) {
    var resourceId = req.body.id;
    var requestUserId = resource.requestUserId;
    var requestUserName = resource.requestUserName;
    //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
    getUserPermissions(requestUserId, requestUserName)
    .then(accessInfo => {
        if (accessInfo != undefined){
            logger.info('Permiso recuperado para usuario ' + requestUserName);
            //2. ADD RESOURCE IN CKAN
            deleteResourceInCKAN(accessInfo, resourceId)
            .then( insertCkanResponse => {
                res.json(JSON.parse(insertCkanResponse));
            });
         
        } else {
            logger.error('BORRADO DE RECURSOS - Usuario no autorizado: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE RECURSOS - Usuario no autorizado' });
        }
    }).catch(error => {
        logger.error('BORRADO DE RECURSOS - Error al obtener la información del usuario: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE RECURSOS - Usuario no autorizado' });
        return;
    });
})




var getUserPermissions = function checkUserPermissions(userId, userName) {
    return new Promise((resolve, reject) => {
        try {
            const query = {
                text: dbQueries.DB_ADMIN_GET_USER_APP_PERMISSIONS,
                values: [userId, userName, constants.APPLICATION_NAME_CKAN],
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };

            pool.on('error', (error, client) => {
                reject(error);
            });

            pool.connect((connError, client, release) => {
                if (connError) {
                    return console.error('Error acquiring client', connError.stack)
                }
                client.query(query, (queryError, queryResult) => {
                    release();
                    if (queryError) {
                        reject(queryError.stack);
                    } else {
                        resolve(queryResult.rows[0]);
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

var insertDatasetInCkan = function insertDatasetInCkan(userAccessInfo, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Insertando dataset en CKAN');
            console.log(dataset);
            //Mandatory fields
            var create_dataset_post_data = {
                'name': dataset.name,
                'private': dataset.private
            };
          
            //Optional fields
              //Optional fields
              if (dataset.title != '') {
                create_dataset_post_data.title = dataset.title;
            }
            if (dataset.author != '') {
                create_dataset_post_data.author = dataset.author;
            }
            if (dataset.author_email != '') {
                create_dataset_post_data.author_email = dataset.author_email;
            }
            if (dataset.notes != '') {
                create_dataset_post_data.notes = dataset.notes;
            }
            if (dataset.url != '') {
                create_dataset_post_data.url = dataset.url;
            }
            if (dataset.version != '') {
                create_dataset_post_data.version = dataset.version;
            }
            if (dataset.state != '') {
                create_dataset_post_data.state = dataset.state;
            }
            if (dataset.extras != '') {
                create_dataset_post_data.extras = dataset.extras;
            }
            if (dataset.tags != '') {
                create_dataset_post_data.tags = dataset.tags;
            }  
            if (dataset.license_id != '') {
                create_dataset_post_data.license_id = dataset.license_id;
            }
            if (dataset.license_title != '') {
                create_dataset_post_data.license_title = dataset.license_title;
            }
            if (dataset.license_url != '') {
                create_dataset_post_data.license_url = dataset.license_url;
            }
            if (dataset.groups != '') {
                create_dataset_post_data.groups = dataset.groups;
            }
            if (dataset.owner_org != '') {
                create_dataset_post_data.owner_org = dataset.owner_org;
            }     
            
            
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_DATASET_CREATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_dataset_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_dataset_post_data));
            logger.info('Configuración llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        logger.info('Código de respuesta: : ' + JSON.stringify(res.statusCode));
                        logger.info('Respuesta: ' + JSON.stringify(body));
                        resolve(body);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }                
            });
        } catch (error) {
            reject(error);
            console.log(error);
            //reject(error);
        }
    });
}


var updateDatasetInCkan = function updateDatasetInCkan(userAccessInfo, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Actualizando dataset en CKAN');
            delete dataset.requestUserId;
            delete dataset.requestUserName;
            //Mandatory fields
            var create_dataset_post_data = {
                'name': dataset.name,
                'private': dataset.private
            };
          
            //Optional fields
            if (dataset.title != '') {
                create_dataset_post_data.title = dataset.title;
            }
            if (dataset.author != '') {
                create_dataset_post_data.author = dataset.author;
            }
            if (dataset.author_email != '') {
                create_dataset_post_data.author_email = dataset.author_email;
            }
            if (dataset.notes != '') {
                create_dataset_post_data.notes = dataset.notes;
            }
            if (dataset.url != '') {
                create_dataset_post_data.url = dataset.url;
            }
            if (dataset.version != '') {
                create_dataset_post_data.version = dataset.version;
            }
            if (dataset.state != '') {
                create_dataset_post_data.state = dataset.state;
            }
            if (dataset.extras != '') {
                create_dataset_post_data.extras = dataset.extras;
            }
            if (dataset.tags != '') {
                create_dataset_post_data.tags = dataset.tags;
            }  
            if (dataset.license_id != '') {
                create_dataset_post_data.license_id = dataset.license_id;
            }
            if (dataset.license_title != '') {
                create_dataset_post_data.license_title = dataset.license_title;
            }
            if (dataset.license_url != '') {
                create_dataset_post_data.license_url = dataset.license_url;
            }
            if (dataset.groups != '') {
                create_dataset_post_data.groups = dataset.groups;
            }
            if (dataset.owner_org != '') {
                create_dataset_post_data.owner_org = dataset.owner_org;
            }           
            console.log(JSON.stringify(dataset));
            
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_DATASET_UPDATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: dataset,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_dataset_post_data));
            logger.info('Configuración llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        logger.info('Código de respuesta: : ' + JSON.stringify(res.statusCode));
                        logger.info('Respuesta: ' + JSON.stringify(body));
                        resolve(body);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }                
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

var deleteDatasetInCKAN = function deleteDatasetInCKAN(userAccessInfo, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando dataset en CKAN');
            //Mandatory fields
            var create_dataset_post_data = {
                'id': dataset
            }; 
            
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_DATASET_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_dataset_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_dataset_post_data));
            logger.info('Configuración llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        logger.info('Código de respuesta: : ' + JSON.stringify(res.statusCode));
                        logger.info('Respuesta: ' + JSON.stringify(body));
                        resolve(body);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }                
            });
        } catch (error) {
            //reject(error);
        }
    });
}

var insertResourceInCKAN = function insertResourceInCKAN(userAccessInfo, clientRequest) {
    return new Promise((resolve, reject) => {
        try {
            let resource = clientRequest.body;
            let file = clientRequest.file;
            console.log(clientRequest.body);

            let form_data = {
                package_id: resource.package_id,
                name: resource.name,
                format: clientRequest.body.format,
                description: clientRequest.body.description } ;
            
            if (resource.url != undefined) {
                form_data.url = clientRequest.body.url;
            }

            if ( file != undefined) {
                form_data.upload = { value:clientRequest.file.buffer,
                    options: { filename: clientRequest.file.originalname, contentType: null } };
            }

            logger.debug('Insertando recurso en CKAN');

            var options = { 
            method: 'POST',
            url: 'http://localhost:5000/api/action/resource_create',
            headers: 
             { 'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
               'Authorization': userAccessInfo.accessKey,
               'content-type': 'multipart/form-data'},
            formData: form_data}
               
          request(options, function (error, response, body) {
            if (error) {
                reject(error);
            }
            console.log(body);
            resolve(body);
          });
        } catch (error) {
            reject(error);
            console.error(error);
        }
    });
}


var deleteResourceInCKAN = function deleteResourceInCKAN(userAccessInfo, resource_id) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando dataset en CKAN');
            //Mandatory fields
            var delete_resource_post_data = {
                'id': resource_id
            }; 
            
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_RESOURCE_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: delete_resource_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_dataset_post_data));
            logger.info('Configuración llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        logger.info('Código de respuesta: : ' + JSON.stringify(res.statusCode));
                        logger.info('Respuesta: ' + JSON.stringify(body));
                        resolve(body);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }                
            });
        } catch (error) {
            //reject(error);
        }
    });
}



module.exports = router;