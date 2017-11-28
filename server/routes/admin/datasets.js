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
        serviceRequestUrl += '&include_private=true';
        logger.notice('URL de petición: ' + serviceRequestUrl);
        let apiKey = utils.getApiKey(req.get('Authorization'));
        if (apiKey) {
            logger.info('API KEY del usuario recuperada: ' + apiKey);
            var httpRequestOptions = {
                url: serviceRequestUrl,
                method: constants.HTTP_REQUEST_METHOD_GET,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };
            request(httpRequestOptions, function (err, response, body) {
                if (err) {
                    utils.errorHandler(err, res, serviceName);
                }
                if (response) {
                    if (response.statusCode == 200) {
                        res.json(body);
                    } else {
                        res.json(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER DATASETS - Error al obtener los datasets' });
                }
            });
        }else {
            logger.error('OBTENER DATASETS - Usuario no autorizado');
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER DATASETS - API KEY incorrecta' });
            return;
        }
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
        let apiKey = utils.getApiKey(req.get('Authorization'));
        if (apiKey) {
            logger.info('API KEY del usuario recuperada: ' + apiKey);
            var httpRequestOptions = {
                url: serviceRequestUrl,
                method: constants.HTTP_REQUEST_METHOD_GET,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };
            request(httpRequestOptions, function (err, response, body) {
                if (err) {
                    utils.errorHandler(err, res, serviceName);
                }
                if (response) {
                    if (response.statusCode == 200) {
                        res.json(body);
                    } else {
                        res.json(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER DATASET POR NOMBRE - Error al obtener el dataset' });
                }
            });
        }else {
            logger.error('OBTENER DATASET POR NOMBRE - Usuario no autorizado');
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER DATASET POR NOMBRE - API KEY incorrecta' });
            return;
        }
    } catch (error) {
        console.log(error);
        logger.error('Error in route' + constants.API_URL_DATASETS);
    }
});

/** CREATE DATASET */
router.post(constants.API_URL_ADMIN_DATASET, function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset que llega desde request: ' + JSON.stringify(dataset));
        //0. CHECKING REQUEST PARAMETERS
        if (dataset.name != ''&& dataset.private != undefined) {
            let apiKey = utils.getApiKey(req.get('Authorization'));
            if (apiKey) {
                logger.info('API KEY del usuario recuperada: ' + apiKey);
                    //2. INSERTING USER IN CKAN
                    insertDatasetInCkan(apiKey, dataset)
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
                // }).catch(error => {
                //     logger.error('INSERCCIÓN DE DATASETS - Usuario no autorizado: ', error);
                //     res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'INSERCCIÓN DE DATASETS - Usuario no autorizado' });
                //     return;
                // });
            } else {
                logger.error('OBTENER USUARIO - Usuario no autorizado');
                res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER USUARIO - API KEY incorrecta' });
                return;
            }
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
router.put(constants.API_URL_ADMIN_DATASET, function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset que llega desde request: ' + JSON.stringify(dataset));
        //0. CHECKING REQUEST PARAMETERS
        if (dataset.name != ''&& dataset.private != undefined) {
            let apiKey = utils.getApiKey(req.get('Authorization'));
            if (apiKey) {
                logger.info('API KEY del usuario recuperada: ' + apiKey);
                //2. INSERTING USER IN CKAN
                updateDatasetInCkan(apiKey, dataset)
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
                } else {
                    logger.error('ACTUALIZACIÓN DE DATASETS - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ACTUALIZACIÓN DE DATASETS - Usuario no autorizado' });
                    return;
                }
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
router.delete(constants.API_URL_ADMIN_DATASET, function (req, res, next) {
    try {
        var dataset = req.body;
        logger.notice('Dataset a borrar: ' + JSON.stringify(dataset.name));
        //0. CHECKING REQUEST PARAMETERS
        if(dataset.name != ''){
            let apiKey = utils.getApiKey(req.get('Authorization'));
            if (apiKey) {
                logger.info('API KEY del usuario recuperada: ' + apiKey);
                //2. DELETING DATASET IN CKAN
                deleteDatasetInCKAN(apiKey, dataset.name)
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
router.post(constants.API_URL_ADMIN_RESOURCE, upload.single('file'), function (req, res, next) {
    try {
        var resource = req.body;
        let apiKey = utils.getApiKey(req.get('Authorization'));
        if (apiKey) {
            logger.info('API KEY del usuario recuperada: ' + apiKey);
            if (resource.resource_type != 'view'){
                //2. ADD RESOURCE IN CKAN
                insertResourceInCKAN(apiKey, req)
                .then( insertCkanResponse => {
                    res.json(JSON.parse(insertCkanResponse));
                });
            } else {
                let resourceJSON = req;
                resourceJSON.body.format = 'JSON';
                resourceJSON.body.url = constants.GA_OD_CORE_BASE_URL+'/download?view_id='+resourceJSON.body.view_id+'&formato=json';
                //2. ADD RESOURCE IN CKAN
                insertResourceInCKAN(apiKey, resourceJSON)
                .then( insertCkanResponseJson => {
                    if (insertCkanResponseJson) {
                        let resourceCSV = req;
                        resourceCSV.body.format = 'CSV';
                        resourceCSV.body.url = constants.GA_OD_CORE_BASE_URL+'/download?view_id='+resourceCSV.body.view_id+'&formato=csv';
                        insertResourceInCKAN(apiKey, resourceCSV)
                        .then( insertCkanResponseCsv => {
                            if ( insertCkanResponseCsv){
                                let resourceXML = req;
                                resourceXML.body.format = 'XML';
                                resourceXML.body.url = constants.GA_OD_CORE_BASE_URL+'/download?view_id='+resourceXML.body.view_id+'&formato=xml';
                        
                                insertResourceInCKAN(apiKey, resourceXML)
                                .then( insertCkanResponseXml => {
                                    if(insertCkanResponseXml){
                                        res.json(JSON.parse(insertCkanResponseXml));
                                    }else{
                                        logger.error('CREACCION DE RECURSOS - Error al Insertar XML: ', error);
                                        res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'CREACCION DE RECURSOS - Error al Insertar XML' });
                                    }
                                });
                            } else {
                                logger.error('CREACCION DE RECURSOS - Error al Insertar CSV: ', error);
                                res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'CREACCION DE RECURSOS - Error al Insertar CSV' });
                            }
                        });
                    } else {
                        logger.error('CREACCION DE RECURSOS - Error al Insertar JSON: ', error);
                        res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'CREACCION DE RECURSOS - Error al Insertar JSON' });
                    }
                });
            }
        } else {
            logger.error('CREACCION DE RECURSOS - Usuario no autorizado: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'CREACCION DE RECURSOS - Usuario no autorizado' });
            return;
        }
    } catch (error) {
        logger.error('CREACCION DE RECURSOS - Error al crear el recurso: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACCION DE RECURSOS - Error al crear el recurso' });
        return;
    }    
  })

  /** UPDATE RESOURCE */
router.put(constants.API_URL_ADMIN_RESOURCE, function (req, res, next) {
    try {
        var resource = req.body;
        logger.notice('Recurso que llega desde request: ' + JSON.stringify(resource));
        //0. CHECKING REQUEST PARAMETERS
        if (resource.name != '') {
            let apiKey = utils.getApiKey(req.get('Authorization'));
            if (apiKey) {
                logger.info('API KEY del usuario recuperada: ' + apiKey);
                //2. INSERTING USER IN CKAN
                updateResourceInCkan(apiKey, resource)
                    .then(insertCkanResponse => {
                        logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                        logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                        if (insertCkanResponse && insertCkanResponse != null && insertCkanResponse.success) {
                            logger.info('Recurso actualizado ');
                            var successJson = { 
                                'status': constants.REQUEST_REQUEST_OK, 
                                'success': true,
                                'result':'ACTUALIZACIÓN DE RECURSOS - Recurso actualizado correctamente'
                            };
                            res.json(successJson);
                        } else {
                            logger.error('ACTUALIZACIÓN DE RECURSOS - Error al insertar el recurso en CKAN: ' + JSON.stringify(insertCkanResponse));
                            var errorJson = { 
                                'status': constants.REQUEST_ERROR_BAD_DATA, 
                                'error': 'ACTUALIZACIÓN DE RECURSOS - Error al insertar al dataset en CKAN',
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
                        logger.error('ACTUALIZACIÓN DE RECURSOS - Respuesta del servidor errónea: ' + error);
                        if (error == '409 - "Conflict"') {
                            res.json({ 'status': constants.REQUEST_ERROR_CONFLICT, 'error': 'ACTUALIZACIÓN DE RECURSOS - Conflicto al actualizar recurso, conflicto en algun parametro.', 
                                        'errorTitle': 'Error al actualizar Recurso', 'errorDetail': 'Conflicto en algun parametro.'});
                        } else {
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE RECURSOS - Respuesta del servidor errónea' });
                        }
                        return;
                    });
            } else {
                logger.error('ACTUALIZACIÓN DE RECURSOS - Usuario no autorizado: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ACTUALIZACIÓN DE RECURSOS - Usuario no autorizado' });
                return;
            }
        } else {
            logger.error('ACTUALIZACIÓN DE RECURSOS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE RECURSOS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('ACTUALIZACIÓN DE RECURSOS - Error actualizando recurso');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE RECURSOS - Error actualizando recurso' });
    }
});

/** DELETE RESOURCE */
router.delete(constants.API_URL_ADMIN_RESOURCE, function (req, res, next) {
    try {
        logger.info('Borrando recurso ');
        var resource = req.body;
        var resourceId = resource.id;
        let apiKey = utils.getApiKey(req.get('Authorization'));
        if (apiKey) {
            logger.info('API KEY del usuario recuperada: ' + apiKey);
            //2. REMOVE RESOURCE
            deleteResourceInCKAN(apiKey, resourceId)
            .then( deleteResourceCkanResponse => {
                if (deleteResourceCkanResponse.success) {
                    logger.info('Recurso borrado correctamente');
                    var successJson = { 
                        'status': constants.REQUEST_REQUEST_OK, 
                        'success': true,
                        'result':'BORRADO DE RECURSO - Recurso borrado correctamente'
                    };
                    res.json(successJson);
                } else {
                    logger.error('BORRADO DE RECURSO - Error al borrar el recurso ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE RECURSO - Error al borrar el recurso' });
                }
            });
        } else {
            logger.error('BORRADO DE RECURSO - Usuario no autorizado: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE RECURSOS - Usuario no autorizado' });
        }
    } catch (error) {
        logger.error('BORRADO DE RECURSOS - Error borrando recurso');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE RECURSOS - Error borrando recurso' });
    }
})

/** GET USER PERMISSIONS FUNCTION */
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

var insertDatasetInCkan = function insertDatasetInCkan(apiKey, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Insertando dataset en CKAN');
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
            
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_DATASET_CREATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_dataset_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
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
        }
    });
}

/** UPDATE DATASET IN CKAN FUNCTION */
var updateDatasetInCkan = function updateDatasetInCkan(apiKey, dataset) {
    return new Promise((resolve, reject) => {
        try {
            
            logger.debug('Actualizando dataset en CKAN');
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_DATASET_UPDATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: dataset,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };

            //logger.info('Datos a enviar: ' + JSON.stringify(update_dataset_post_data));
            logger.info('Datos a enviar: ' + JSON.stringify(dataset));
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
            reject(error);
        }
    });
}

/** DELETE DATASET IN CKAN FUNCTION */
var deleteDatasetInCKAN = function deleteDatasetInCKAN(apiKey, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando dataset en CKAN');
            //Mandatory fields
            var delete_dataset_post_data = {
                'id': dataset
            }; 
            
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_DATASET_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: delete_dataset_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(delete_dataset_post_data));
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
        }
    });
}

/** PURGE DATASET IN CKAN FUNCTION */
var purgeDatasetInCKAN = function purgeDatasetInCKAN(apiKey, dataset) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando dataset de CKAN definitivamente');
            //Mandatory fields
            var purge_dataset_post_data = {
                'id': dataset
            }; 
            
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_DATASET_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: purge_dataset_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(purge_dataset_post_data));
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
        }
    });
}

/** INSERT RESOURCE IN CKAN FUNCTION */
var insertResourceInCKAN = function insertResourceInCKAN(apiKey, clientRequest) {
    return new Promise((resolve, reject) => {
        try {
            let resource = clientRequest.body;
            let file = clientRequest.file;

            let form_data = {
                package_id: resource.package_id,
                name: resource.name,
                format: clientRequest.body.format,
                resource_type: clientRequest.body.resource_type,
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
            url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_RESOURCE_CREATE,
            headers: 
             { 'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
               'Authorization': apiKey,
               'content-type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_MULTIPART_FORM_DATA},
            formData: form_data}
               
          request(options, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
          });
        } catch (error) {
            reject(error);
            console.error(error);
        }
    });
}

/** UPDATE RESOURCE IN CKAN FUNCTION */
var updateResourceInCkan = function updateDatasetInCkan(apiKey, resource) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Actualizando recurso en CKAN');
            
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_RESOURCE_UPDATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: resource,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(resource));
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

/** DELETE RESOURCE IN CKAN FUNCTION */
var deleteResourceInCKAN = function deleteResourceInCKAN(apiKey, resource_id) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando recurso en CKAN');
            //Mandatory fields
            var delete_resource_post_data = {
                'id': resource_id
            }; 
            
            var httpRequestOptions = {
                url: constants.CKAN_API_BASE_URL + constants.CKAN_URL_PATH_RESOURCE_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: delete_resource_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': apiKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(delete_resource_post_data));
            logger.info('Configuración llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    resolve(res.body);
                } else {
                    reject('Respuesta nula');
                }                
            });
        } catch (error) {
            reject(error);
            console.error(error);
        }
    });
}

module.exports = router;