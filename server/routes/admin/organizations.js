const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const proxy = require('../../conf/proxy-conf');
const request = require('request');
const utils = require('../../util/utils');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** GET ALL ORGANIZATIONS */
router.get(constants.API_URL_ORGANIZATIONS, function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de organizaciones');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.ORGANIZATIONS_LIST;
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
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err,res,serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_ORGANIZATIONS);
    }
    
});


router.post('/organization', function (req, res, next) {
    try {
        var organization = req.body;
        logger.notice('Organización que llega desde request: ' + JSON.stringify(organization));
        //0. CHECKING REQUEST PARAMETERS
        if (organization.requestUserId != '' && organization.requestUserName != '' && organization.name != '') {
             var requestUserId = organization.requestUserId;
             var requestUserName = organization.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    console.log(accessInfo);
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. INSERTING ORGANIZATION IN CKAN
                    insertOrganizationInCkan(accessInfo, organization)
                        .then(insertCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                            if (insertCkanResponse && insertCkanResponse != null && insertCkanResponse.success) {
                                logger.info('Organización insertada ' + insertCkanResponse.result.name);
                                res.json({
                                    'status': constants.REQUEST_REQUEST_OK,
                                    'success': 'true',
                                    'message': 'Organización insertada correctamente.'                             
                                });
                                return;
                            } else {
                                logger.error('ALTA DE ORGANIZACIONES - Error al insertar la organización en CKAN: ' + JSON.stringify(insertCkanResponse));
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'ALTA DE ORGANIZACIONES - Error al insertar la organización en CKAN',

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
                            logger.error('ALTA DE ORGANIZACIONES - Respuesta del servidor errónea: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE ORGANIZACIONES - Respuesta del servidor errónea' });
                            return;
                        });
                }).catch(error => {
                    logger.error('ALTA DE ORGANIZACIONES - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ALTA DE ORGANIZACIONES - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('ALTA DE ORGANIZACIONES - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE ORGANIZACIONES - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('ALTA DE ORGANIZACIONES - Error creando organización');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE ORGANIZACIONES - Error creando organización' });
    }
});

router.put('/organization', function (req, res, next) {
    try {
        var organization = req.body;
        logger.notice('Organización que llega desde request: ' + JSON.stringify(organization));
        //0. CHECKING REQUEST PARAMETERS
        if (organization.requestUserId != '' && organization.requestUserName != '' && organization.name != '') {
             var requestUserId = organization.requestUserId;
             var requestUserName = organization.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    console.log(accessInfo);
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. UPDATING ORGANIZATION IN CKAN
                    updateOrganizationInCkan(accessInfo, organization)
                        .then(updateCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(updateCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + updateCkanResponse.success);
                            if (updateCkanResponse && updateCkanResponse != null && updateCkanResponse.success) {
                                logger.info('Organización actualizada ' + updateCkanResponse.result.name);
                                res.json({
                                    'status': constants.REQUEST_REQUEST_OK,
                                    'success': 'true',
                                    'message': 'Organización actualizada correctamente.'                             
                                });
                                return;
                            } else {
                                logger.error('ACTUALIZACIÓN DE ORGANIZACIONES - Error al actualizar la organización en CKAN: ' + JSON.stringify(updateCkanResponse));
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'ACTUALIZACIÓN DE ORGANIZACIONES - Error al actualizar la organización en CKAN',

                                };
                                if (updateCkanResponse && updateCkanResponse != null
                                    && updateCkanResponse.error && updateCkanResponse.error != null
                                    && updateCkanResponse.error.name && updateCkanResponse.error.name != null) {
                                    errorJson.message = updateCkanResponse.error.name;
                                }
                                res.json(errorJson);
                                return;
                            }
                        }).catch(error => {
                            logger.error('ACTUALIZACIÓN DE ORGANIZACIONES - Respuesta del servidor errónea: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE ORGANIZACIONES - Respuesta del servidor errónea' });
                            return;
                        });
                }).catch(error => {
                    logger.error('ACTUALIZACIÓN DE ORGANIZACIONES - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ACTUALIZACIÓN DE ORGANIZACIONES - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('ACTUALIZACIÓN DE ORGANIZACIONES - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE ORGANIZACIONES - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('ACTUALIZACIÓN DE ORGANIZACIONES - Error actualizando organización');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE ORGANIZACIONES - Error actualizando organización' });
    }
});

router.delete('/organization', function (req, res, next) {
    try {
        var organization = req.body;
        logger.notice('Organización a borrar que llega desde request: ' + JSON.stringify(organization));
        //0. CHECKING REQUEST PARAMETERS
        if (organization.requestUserId != '' && organization.requestUserName != '' && organization.name != '') {
             var requestUserId = organization.requestUserId;
             var requestUserName = organization.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. DELETING ORGANIZATION IN CKAN
                    deleteOrganizationInCkan(accessInfo, organization)
                        .then(insertCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                            if (insertCkanResponse && insertCkanResponse.result == null && insertCkanResponse.success) {
                                logger.info('Organización borrada ' + organization.name);
                                res.json({
                                    'status': constants.REQUEST_REQUEST_OK,
                                    'success': 'true',
                                    'message': 'Organización borrada correctamente.'                             
                                });
                                return;
                            } else {
                                logger.error('BORRADO DE ORGANIZACIONES - Error al borrar la organización en CKAN: ' + JSON.stringify(insertCkanResponse));
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'BORRADO DE ORGANIZACIONES - Error al borrar la organización en CKAN',

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
                            logger.error('BORRADO DE ORGANIZACIONES - Respuesta del servidor errónea: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE ORGANIZACIONES - Respuesta del servidor errónea' });
                            return;
                        });
                }).catch(error => {
                    console.log(error);
                    logger.error('BORRADO DE ORGANIZACIONES - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'BORRADO DE ORGANIZACIONES - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('BORRADO DE ORGANIZACIONES - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE ORGANIZACIONES - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('BORRADO DE ORGANIZACIONES - Error borrando organización');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE ORGANIZACIONES - Error borrando organización' });
    }
});

var insertOrganizationInCkan = function insertOrganizationInCkan(userAccessInfo, organization) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Insertando organización en CKAN');
            //Mandatory fields
            var create_organization_post_data = {
                'name': organization.name,
                'title': organization.title,
                'description': organization.description,
                'extras': []
            };
            //Optional fields
            if (organization.description != '') {
                create_organization_post_data.description = organization.description;
             }
            if(organization.extras != undefined){
                for(var index=0;index<organization.extras.length; index++){
                    if(organization.extras[index].key =='webpage'){
                        create_organization_post_data.extras.push({"key": organization.extras[index].key, "value": organization.extras[index].value});
                    }
                    if (organization.extras[index].key == 'address') {
                        create_organization_post_data.extras.push({"key": organization.extras[index].key, "value": organization.extras[index].value});
                    }
                    if (organization.extras[index].key == 'person') {
                        create_organization_post_data.extras.push({"key": organization.extras[index].key, "value": organization.extras[index].value});
                    }
                }
            }          
            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_ORGANIZATION_CREATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_organization_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_organization_post_data));
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

var updateOrganizationInCkan = function updateOrganizationInCkan(userAccessInfo, organization) {
    return new Promise((resolve, reject) => {
        try {         
            logger.debug('Actualizando organización en CKAN');      
            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_ORGANIZATION_UPDATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: organization,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(organization));
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

var deleteOrganizationInCkan = function deleteOrganizationInCkan(userAccessInfo, organization) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando organización en CKAN');
            //Mandatory fields
            var delete_organization_post_data = {
                'id': organization.name
            };
            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_ORGANIZATION_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: delete_organization_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(delete_organization_post_data));
            logger.info('Configuraćión llamada POST: ' + JSON.stringify(httpRequestOptions));

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
            console.log(error);
            reject(error);
        }
    });
}

var getUserPermissions = function checkUserPermissions(userId, userName) {
    return new Promise((resolve, reject) => {
        try {
            const query = {
                text: dbQueries.DB_ADMIN_GET_USER_APP_PERMISSIONS,
                values: [userId, userName, constants.APPLICATION_NAME_CKAN],
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };

            // pool.on('error', (error, client) => {
            //     process.exit(-1);
            //     reject(error);
            // });
            pool.connect((connError, client, release) => {
                if (connError) {
                  return console.error('Error acquiring client', connError.stack)
                }
                client.query(query, (err, queryResult) => {
                  release()
                  if (err) {
                    return console.error('Error executing query', err.stack)
                  }else{
                    resolve(queryResult.rows[0]);
                  }

                })
              })
        } catch (error) {
            reject(error);
        }
   });
}



// var getUserPermissions = function checkUserPermissions(userId, userName) {
//     return new Promise((resolve, reject) => {
//         try {
//             const query = {
//                 text: dbQueries.DB_ADMIN_GET_USER_APP_PERMISSIONS,
//                 values: [userId, userName, constants.APPLICATION_NAME_CKAN],
//                 rowMode: constants.SQL_RESULSET_FORMAT_JSON
//             };
            

//             pool.on('error', (error, client) => {
//                 process.exit(-1);
//                 reject(error);
//             });

//             pool.connect((connError, client, done) => {
//                 done();
//                 if (connError) {
//                     reject(connError.stack);
//                 }
//                 client.query(query, (queryError, queryResult) => {
//                     done();
//                     if (queryError) {
//                         reject(queryError.stack);
//                     } else {
//                         resolve(queryResult.rows[0]);
//                     }
//                 });
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

module.exports = router;