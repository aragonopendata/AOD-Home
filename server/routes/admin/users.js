const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");
const request = require('request');
const proxy = require('../../conf/proxy-conf');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get('/users', function (req, res, next) {
    try {

        pool.connect(function(err,client,done) {
            const queryDb = {
                text: dbQueries.DB_ADMIN_GET_USERS_JSON,
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };
            client.query(queryDb, function (err, result) {
                done()
                if (err) {
                  return next(err)
                }
                res.json(result.rows)
              })
        }).catch(connError => {
            
            logger.error('Error en la conexión con base de datos', connError);
            console.error('connectionError', connError.message, connError.stack)
        })

    } catch (error) {
        logger.error('Error in users admin');
    }
});

router.post('/user/:userName', function (req, res, next) {
    try {
        var user = req.body;
        logger.notice('Usuario que llega desde request: ' + JSON.stringify(user));
        //0. CHECKING REQUEST PARAMETERS
        if (user.requestUserId != '' && req.params.userName != '') {
            var requestUserId = user.requestUserId;
        getUserAPIKey(requestUserId)
        .then(userAPIKey => {
            logger.info('API KEY del usuario recuperada');
            getUserDetails(userAPIKey, req.params.userName)
                .then(getUserResponse => {
                    logger.info('Respuesta de CKAN success: ' + getUserResponse.success);
                    if (getUserResponse) {
                        res.json(getUserResponse);
                    } else {
                        logger.error('OBTENER Organizaciones - Error al obtener las organizaciones de CKAN: ' + JSON.stringify(getOrganizationResponse));
                        var errorJson = {
                            'status': constants.REQUEST_ERROR_BAD_DATA,
                            'error': 'OBTENER Usuario - Error al obtener el usuario en CKAN',
                        };
                        if (getUserResponse && getUserResponse != null
                            && getUserResponse.error && getUserResponse.error != null
                            && getUserResponse.error.name && getUserResponse.error.name != null) {
                            errorJson.message = getUserResponse.error.name;
                        }
                        res.json(errorJson);
                        return;
                    }
                }).catch(error => {
                    console.log(error);
                    logger.error('ALTA DE USUARIOS - Error al insertar al usuario en base de datos: ' + error);
                    res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Error al insertar al usuario en base de datos' });
                    return;
                });
        }).catch(error => {
            logger.error('OBTENER ORGANIZACIONES POR USUARIO - Usuario no autorizado: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER ORGANIZACIONES POR USUARIO - Usuario no autorizado' });
            return;
        });
    } else {
        logger.error('OBTENER ORGANIZACIONES POR USUARIO - Parámetros incorrectos');
        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'OBTENER ORGANIZACIONES POR USUARIO - Parámetros incorrectos' });
        return;
    }
    } catch (error) {
        logger.error('Error obteniendo el usuario');
    }
});

router.post('/user', function (req, res, next) {
    try {
        var user = req.body;
        logger.notice('Usuario que llega desde request: ' + JSON.stringify(user));
        //0. CHECKING REQUEST PARAMETERS
        if (user.requestUserId != '' && user.requestUserName != '' && user.name != ''
            && user.email != '' && user.password != '' && user.role != '') {
            var requestUserId = user.requestUserId;
            var requestUserName = user.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. INSERTING USER IN CKAN
                    insertUserInCkan(accessInfo, user)
                        .then(insertCkanResponse => {
                            logger.info('Respuesta de CKAN: ' + JSON.stringify(insertCkanResponse));
                            logger.info('Respuesta de CKAN success: ' + insertCkanResponse.success);
                            if (insertCkanResponse && insertCkanResponse != null && insertCkanResponse.success) {
                                logger.info('Usuario insertado ' + insertCkanResponse.result.fullname);
                                //3. INSERTING USER IN AOD_MANAGER AND ASSIGNING PERMISSIONS
                                insertUserInManager(user, accessInfo, insertCkanResponse.result)
                                    .then(userId => {
                                        logger.info('Usuario asociado a rol: ' + userId);
                                        // GET CKAN GROUPS
                                        getCkanGroups(accessInfo).then(groupsResponse => {
                                            if (groupsResponse) {
                                                setGroupsToUser(accessInfo,user, groupsResponse).then(setGroupsToUserResponse => {
                                                    if (setGroupsToUserResponse) {
                                                        res.json({ 'status': constants.REQUEST_REQUEST_OK});
                                                    } else {
                                                        logger.error('ALTA DE USUARIOS - No se ha podido insertar el usuario en base de datos');
                                                        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - No se ha podido insertar el usuario en base de datos' });
                                                    }
                                                })
                                            } else {
                                                logger.error('ALTA DE USUARIOS - No se ha podido obtener la lista de temas');
                                                res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - No se ha podido obtener la lista de temas' });
                                            }
                                        })
                                       
                                    }).catch(error => {
                                        console.log("errorPool");
                                        console.log(error);
                                        logger.error('ALTA DE USUARIOS - Error al insertar al usuario en base de datos: ' + error);
                                        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Error al insertar al usuario en base de datos' });
                                        return;
                                    });
                            } else {
                                logger.error('ALTA DE USUARIOS - Error al insertar al usuario en CKAN: ' + JSON.stringify(insertCkanResponse));
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'ALTA DE USUARIOS - Error al insertar al usuario en CKAN',

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
                            if (error == '409 - "Conflict"') {
                                res.json({
                                    'status': constants.REQUEST_ERROR_CONFLICT, 'error': 'ALTA DE USUARIOS - Conflicto al crear usuario, nombre de usuario en uso',
                                    'errorTitle': 'Error al crear usuario', 'errorDetail': 'Nombre del usuario en uso'
                                });
                            } else {
                                res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Respuesta del servidor errónea' });
                            }
                            logger.error('ALTA DE USUARIOS - Respuesta del servidor errónea: ' + error);
                            return;
                        });
                }).catch(error => {
                    console.log("err");
                    console.log(error);
                    logger.error('ALTA DE USUARIOS - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ALTA DE USUARIOS - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('ALTA DE USUARIOS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        console.log(error);
        logger.error('ALTA DE USUARIOS - Error creando usuario');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error creando usuario' });
    }
});

router.put('/user', function (req, res, next) {
    try {
        var user = req.body;
        if (user.requestUserId != '' && user.requestUserName != '' && user.name != '' & user.description != ''
            && user.email != '' && user.fullname != '' && user.role != '' && user.active != '' && user.role != '') {
            var requestUserId = user.requestUserId;
            var requestUserName = user.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    //2. GET USER FROM CKAN
                    getUserInCkan(accessInfo, user.name).then(userInCkan => {
                        if (userInCkan && userInCkan != null) {
                            updateUserInCkan(accessInfo, userInCkan, user).then(updateUserInCkanResponse => {
                                if (updateUserInCkanResponse && updateUserInCkanResponse != null) {
                                    updateUserInManager(user, accessInfo, updateUserInCkanResponse).then(updateUserInManager => {
                                        if (updateUserInManager) {
                                            logger.info('Usuario actualizado de BBDD');
                                            res.json({
                                                'status': constants.REQUEST_REQUEST_OK,
                                                'success': true,
                                                'result': 'ACTUALIZACIÓN DE USUARIOS - Usuario actualizado correctamente'
                                            });
                                        } else {
                                            logger.error('ACTUALIZACIÓN DE USUARIOS - Error al actualizar al usuario de la base de datos: ' + error);
                                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE USUARIOS - Error al actualizar al usuario de la base de datos' });
                                        }
                                    })

                                } else {
                                    //TODO ERROR HANDLING
                                }
                            })
                        } else {
                            //TODO ERROR HANDLING
                        }
                    })
                });
        } else {
            //TODO ERROR HANDLING
        }
    } catch (error) {
        logger.error('ACTUALIZACIÓN DE USUARIOS - Error editando usuario');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE USUARIOS - Error editando usuario' });
    }
});

//user_delete
router.delete('/user', function (req, res, next) {
    try {
        var user = req.body;
        logger.notice('Usuario que llega desde request: ' + JSON.stringify(user));
        //0. CHECKING REQUEST PARAMETERS
        if (user.requestUserId != '' && user.requestUserName != '' && user.name != ''
            && user.email != '' && user.password != '' && user.role != '') {
            var requestUserId = user.requestUserId;
            var requestUserName = user.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            getUserPermissions(requestUserId, requestUserName)
                .then(accessInfo => {
                    logger.info('Permiso recuperado para usuario ' + requestUserName);
                    // 2. DELETE USER IN CKAN
                    deleteUserInCkan(accessInfo, user)
                        .then(deleteCkanResponse => {
                            if (deleteCkanResponse && deleteCkanResponse != null && deleteCkanResponse.success) {
                                deleteUserInManager(user, accessInfo)
                                    .then(deleteUserInManagerResponse => {
                                        if (deleteUserInManagerResponse) {
                                            logger.info('Usuario borrado de BBDD');
                                            res.json({
                                                'status': constants.REQUEST_REQUEST_OK,
                                                'success': true,
                                                'result': 'BORRADO DE USUARIOS - Usuario borrado correctamente'
                                            });
                                        } else {
                                            logger.error('BORRADO DE USUARIOS - Error al borrar al usuario de base de datos: ' + error);
                                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE USUARIOS - Error al borrar al usuario en base de datos' });
                                        }

                                    }).catch(error => {
                                        console.log(error);
                                        logger.error('BORRADO DE USUARIOS - Error al borrar al usuario de base de datos: ' + error);
                                        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'BORRADO DE USUARIOS - Error al borrar al usuario en base de datos' });
                                        return;
                                    });
                            } else {
                                logger.error('BORRADO DE USUARIOS - Error al borrar al usuario de CKAN: ');
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'BORRADO - Error al borrar al usuario de CKAN',
                                };
                                res.json(errorJson);
                            }

                        }).catch(error => {
                            console.log(error);
                            logger.error('BORRADO DE USUARIOS - Respuesta del servidor errónea: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Respuesta del servidor errónea' });
                            return;
                        });
                }).catch(error => {
                    console.log(error);
                    logger.error('BORRADO DE USUARIOS - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ALTA DE USUARIOS - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('BORRADO DE USUARIOS - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        console.log(error);
        logger.error('BORRADO DE USUARIOS - Error borrando usuario');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error creando usuario' });
    }
});

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

var insertUserInCkan = function insertUserInCkan(userAccessInfo, user) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Insertando usuario en CKAN');
            //Mandatory fields
            var create_user_post_data = {
                'name': user.name,
                'email': user.email,
                'password': user.password
            };
            //Optional fields
            if (user.fullname != '') {
                create_user_post_data.fullname = user.fullname;
            }
            if (user.description != '') {
                create_user_post_data.about = user.description;
            }

            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_USER_CREATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_user_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        logger.info('Código de respuesta: : ' + JSON.stringify(res.statusCode));
                        resolve(body);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }
            });
        } catch (error) {
            console.log("insert userCKAN Error: ");
            console.log(error);
            reject(error);
        }
    });
}

var getCkanGroups = function getCkanGroups(userAccessInfo) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Servicio: Obtener Grupos de CKAN');
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_GROUP_LIST,
                method: constants.HTTP_REQUEST_METHOD_GET,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };
            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                if (res) {
                    resolve(body.result);
                } else {
                    reject('Respuesta nula');
                }
            });

        } catch (error) {
            console.log("getUserInCKAN Error: ");
            console.log(error);
            reject(error);
        }
    });
}

var setGroupsToUser = function setGroupsToUser(userAccessInfo, user, groups) {
    return new Promise((resolve, reject) => {
        try {
            for (var i = 0; i < groups.length; i++) {
            //Mandatory fields
            var create_group_post_data = {
                'id': groups[i],
                'username': user.name,
                'role': "admin"
            };

            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_GROUP_MEMBER_CREATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_group_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_group_post_data));
            logger.info('Configuraćión llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    if (res.statusCode == 200) {
                        resolve(true);
                    } else {
                        reject(JSON.stringify(res.statusCode) + ' - ' + JSON.stringify(res.statusMessage));
                    }
                } else {
                    reject('Respuesta nula');
                }
            });
		   }
            
            
            
        } catch (error) {
            console.log("setgroupsCKAN Error: ");
            console.log(error);
            reject(error);
        }
    });
}

var getUserInCkan = function getUserInCkan(userAccessInfo, userName) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Servicio: Obtener Usuario de CKAN');
            var httpRequestOptions = {
                url: 'http://127.0.0.1:5000/api/action/' + constants.CKAN_URL_PATH_USER_SHOW + '?id=' + userName,
                method: constants.HTTP_REQUEST_METHOD_GET,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                if (res) {
                    resolve(body.result);
                } else {
                    reject('Respuesta nula');
                }
            });

        } catch (error) {
            console.log("getUserInCKAN Error: ");
            console.log(error);
            reject(error);
        }
    });
}

var updateUserInCkan = function updateUserInCkan(userAccessInfo, userInCkan, user) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Actualizando usuario en CKAN');
            userInCkan.about = user.description;
            userInCkan.name = user.name;
            userInCkan.fullname = user.fullname;
            userInCkan.email = user.email;
            userInCkan.state = user.state;

            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_USER_UPDATE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: userInCkan,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(userInCkan));
            logger.info('Configuraćión llamada POST: ' + JSON.stringify(httpRequestOptions));
            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    logger.debug('Actualizado usuario en CKAN');
                    if (body.success) {
                        resolve(body.result)
                    }
                } else {
                    reject('Respuesta nula');
                }
            });
        } catch (error) {
            console.log("insert userCKAN Error: ");
            console.log(error);
            reject(error);
        }
    });
}

var deleteUserInCkan = function deleteUserInCkan(userAccessInfo, user) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Borrando usuario en CKAN');
            //Mandatory fields
            var create_user_post_data = {
                'id': user.userNameCkan
            };

            var httpRequestOptions = {
                url: 'http://localhost:5000/api/action/' + constants.CKAN_URL_PATH_USER_DELETE,
                method: constants.HTTP_REQUEST_METHOD_POST,
                body: create_user_post_data,
                json: true,
                headers: {
                    'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                    'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                    'Authorization': userAccessInfo.accessKey
                }
            };

            logger.info('Datos a enviar: ' + JSON.stringify(create_user_post_data));
            logger.info('Configuraćión llamada POST: ' + JSON.stringify(httpRequestOptions));

            request(httpRequestOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    resolve(body);
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

// var insertUserInManager = function insertUserInManager(user, userAccessInfo) {
//     return new Promise((resolve, reject) => {
//         try {
//             var apikey = userAccessInfo.accessKey;
//             var password = user.password = SHA256(user.password).toString(CryptoJS.enc.Base64);
//             var userRole = user.role;
//             var fullname = user.fullname != null ? user.fullname : '';
//             var description = user.description != null ? user.description : '';
//             var createdUserId = null;
//             pool.on('error', (error, client) => {
//                 process.exit(-1);
//                 reject(error);
//             });

//             pool.connect((connError, client, done) => {
//                 const shouldAbort = (transactionRollbackError) => {
//                     if (transactionRollbackError) {
//                         logger.error('Error en transacción', transactionRollbackError.stack);
//                         client.query('ROLLBACK', (rollbackError) => {
//                             if (rollbackError) {
//                                 logger.error('Error en transacción', rollbackError.stack);
//                             }
//                             done();
//                         })
//                     }
//                     return !!transactionRollbackError;
//                 }
//                 logger.notice('Se inicia la transacción de alta de usuario en base de datos AOD_MANAGER');
//                 client.query('BEGIN', (transactionQueryError) => {
//                     if (shouldAbort(transactionQueryError)) {
//                         reject(transactionQueryError);
//                     }
//                     const insertUserQuery = {
//                         text: dbQueries.DB_ADMIN_INSERT_USER,
//                         values: [user.name, password, user.email, user.active, description, fullname]
//                     };
//                     logger.notice('Se procede a insertar el usuario');
//                     client.query(insertUserQuery, (insertUserQueryError, insertUserQueryResponse) => {
//                         if (shouldAbort(insertUserQueryError)) {
//                             reject(insertUserQueryError);
//                         }
//                         logger.notice('Usuario insertado con id: ' + insertUserQueryResponse.rows[0].id);
//                         const insertPermissionsQuery = {
//                             text: dbQueries.DB_ADMIN_INSERT_USER_APP_PERMISSION,
//                             values: [insertUserQueryResponse.rows[0].id, userAccessInfo.applicationId, apikey]
//                         };
//                         logger.notice('Se proceden a insertar los permisos del usuario');
//                         client.query(insertPermissionsQuery, (insertPermissionsQueryError, insertPermissionsQueryResponse) => {
//                             if (shouldAbort(insertPermissionsQueryError)) {
//                                 reject(insertPermissionsQueryError);
//                             }
//                             logger.notice('Se procede a asignar al usuario con el rol: ' + userRole);
//                             const insertUserRoleQuery = {
//                                 text: dbQueries.DB_ADMIN_INSERT_USERS_ROLES,
//                                 values: [insertPermissionsQueryResponse.rows[0].id_user, userRole]
//                             };
//                             client.query(insertUserRoleQuery, (insertUserRoleQueryError, insertUserRoleQueryResponse) => {
//                                 if (shouldAbort(insertUserRoleQueryError)) {
//                                     reject(insertUserRoleQueryError);
//                                 }
//                                 logger.notice('Role del usuario insertado');
//                                 client.query('COMMIT', (commitError) => {
//                                     if (commitError) {
//                                         logger.error('commit error');
//                                     }
//                                     done();
//                                     logger.notice('Transacción completada para el usuario: ' + insertUserRoleQueryResponse.rows[0].id_user);
//                                     resolve(insertUserRoleQueryResponse.rows[0].id_user);
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         } catch (error) {
//             console.log(error);
//             reject(error);
//         }
//     });
// }

var insertUserInManager = function insertUserInManager(user, userAccessInfo, insertCkanResponse) {
    return new Promise((resolve, reject) => {
        try {
            console.log(user);
            var apikey = insertCkanResponse.apikey;
            var password = user.password = SHA256(user.password).toString(CryptoJS.enc.Base64);
            var userRole = user.role;
            var fullname = user.fullname != null ? user.fullname : '';
            var createdUserId = null;

            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                        //done();
                    })
                }
                logger.notice('Se inicia la transacción de alta de usuario en base de datos AOD_MANAGER');

                const insertUserQuery = {
                    text: dbQueries.DB_ADMIN_INSERT_USER,
                    values: [user.name, password, user.email, true, user.description, fullname]
                };

                client.query(insertUserQuery, (insertUserQueryError, insertUserQueryResponse) => {
                    //done()
                    if (insertUserQueryError) {
                        reject(insertUserQueryError);
                        return console.error('Error executing user query', insertUserQueryError.stack)
                    } else {
                        logger.notice('Se proceden a insertar los permisos del usuario');
                        const insertPermissionsQuery = {
                            text: dbQueries.DB_ADMIN_INSERT_USER_APP_PERMISSION,
                            values: [insertUserQueryResponse.rows[0].id, userAccessInfo.applicationId, apikey]
                        };
                        client.query(insertPermissionsQuery, (insertPermissionsQueryError, insertPermissionsQueryResponse) => {
                            //done()
                            if (insertPermissionsQueryError) {
                                reject(insertPermissionsQueryError);
                                return console.error('Error executing permissions query', insertPermissionsQueryError.stack)
                            } else {
                                //resolve(queryResult.rows[0]);
                                logger.notice('Se procede a asignar al usuario con el rol: ' + userRole);
                                const insertUserRoleQuery = {
                                    text: dbQueries.DB_ADMIN_INSERT_USERS_ROLES,
                                    values: [insertPermissionsQueryResponse.rows[0].id_user, userRole]
                                };
                                client.query(insertUserRoleQuery, (insertUserRoleQueryError, insertUserRoleQueryResponse) => {
                                    //                                    done()
                                    if (insertUserRoleQueryError) {
                                        reject(insertUserRoleQueryError)
                                        return console.error('Error executing role query', insertUserRoleQueryError.stack)
                                    } else {
                                        logger.notice('Role del usuario insertado');
                                        client.query('COMMIT', (commitError) => {
                                            done()
                                            if (commitError) {
                                                reject(commitError)
                                                return console.error('Error executing commit', commitError.stack)
                                            } else {
                                                logger.notice('Transacción completada para el usuario: ' + insertUserRoleQueryResponse.rows[0].id_user);
                                                resolve(insertUserRoleQueryResponse.rows[0].id_user);
                                            }
                                        });
                                    }
                                })

                            }
                        })

                    }
                })
            });
        } catch (error) {
            console.log("erro11");
            console.log(error);
            reject(error);
        }
    });
}

var updateUserInManager = function updateUserInManager(user, userAccessInfo, insertCkanResponse) {
    return new Promise((resolve, reject) => {
        try {
            var apikey = insertCkanResponse.apikey;
            var name = user.name != null ? user.name : '';
            var fullname = user.fullname != null ? user.fullname : '';
            var email = user.email != null ? user.email : '';
            var description = user.description != null ? user.description : '';
            var active = user.active != null ? user.active : false;

            var userId = user.id;
            var userRole = user.role;


            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                        //done();
                    })
                }
                logger.notice('Se inicia la transacción de actualización de usuario en base de datos AOD_MANAGER');

                const updateUserQuery = {
                    text: dbQueries.DB_ADMIN_UPDATE_USER,
                    values: [name, fullname, email, description, active, userId]
                };

                client.query(updateUserQuery, (updateUserQueryError, updateUserQueryResponse) => {
                    //done()
                    if (updateUserQueryError) {
                        reject(updateUserQueryError);
                        return console.error('Error executing update user query', updateUserQueryError.stack)
                    } else {
                        logger.notice('Se procede a actualizar el rol del usuario');
                        const insertUserRoleQuery = {
                            text: dbQueries.DB_ADMIN_UPDATE_USER_ROLES,
                            values: [userRole, userId]
                        };
                        client.query(insertUserRoleQuery, (insertUserRoleQueryError, insertUserRoleQueryResponse) => {
                            //done()
                            if (insertUserRoleQueryError) {
                                reject(insertUserRoleQueryError)
                                return console.error('Error executing role query', insertUserRoleQueryError.stack)
                            } else {
                                logger.notice('Role del usuario insertado');
                                client.query('COMMIT', (commitError) => {
                                    done()
                                    if (commitError) {
                                        reject(commitError)
                                        return console.error('Error executing commit', commitError.stack)
                                    } else {
                                        logger.notice('Actualización del usuario completada ');
                                        resolve(true);
                                    }
                                });
                            }
                        })

                    }
                })
            });
        } catch (error) {
            console.log("erro11");
            console.log(error);
            reject(error);
        }
    });
}

var deleteUserInManager = function deleteUserInManager(user, userAccessInfo) {
    return new Promise((resolve, reject) => {
        try {
            var id = user.userIdDb;

            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                        //done();
                    })
                }
                logger.notice('Se inicia la transacción de borrado de usuario en base de datos AOD_MANAGER');

                const deleteUserRolesQuery = {
                    text: dbQueries.DB_ADMIN_DELETE_USERS_ROLES,
                    values: [id]
                };
                logger.notice('Se inicia la transacción de borrado de roles');
                client.query(deleteUserRolesQuery, (deleteUserRolesQueryError, deleteUserRolesQueryResponse) => {
                    //done()
                    if (deleteUserRolesQueryError) {
                        reject(deleteUserRolesQueryError);
                        return console.error('Error executing user query', deleteUserRolesQueryError.stack)
                    } else {
                        const deleteUserPermissionQuery = {
                            text: dbQueries.DB_ADMIN_DELETE_USER_APP_PERMISSION,
                            values: [id]
                        };
                        client.query(deleteUserPermissionQuery, (deleteUserPermissionQueryError, deleteUserPermissionQueryResponse) => {
                            //done()
                            if (deleteUserPermissionQueryError) {
                                reject(deleteUserPermissionQueryError);
                                return console.error('Error executing user query', deleteUserPermissionQueryError.stack)
                            } else {
                                const deleteUserQuery = {
                                    text: dbQueries.DB_ADMIN_DELETE_USER,
                                    values: [id]
                                };
                                client.query(deleteUserQuery, (deleteUserQueryError, deleteUserQueryResponse) => {
                                    //done()
                                    if (deleteUserQueryError) {
                                        reject(deleteUserQueryError);
                                        return console.error('Error executing user query', deleteUserQueryError.stack)
                                    } else {
                                        logger.notice('Borrado de usuario realizado con exito.');
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            console.log("deleteUserInManger");
            console.log(error);
            reject(error);
        }
    });
}

var getUserAPIKey = function getUserAPIKey(userID) {
    return new Promise((resolve, reject) => {
        try {
            const query = {
                text: dbQueries.DB_ADMIN_GET_USER_APIKEY_BY_USER_ID,
                values: [userID, constants.APPLICATION_NAME_CKAN],
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
                    } else {
                        resolve(queryResult.rows[0]);
                    }

                })
            })
        } catch (error) {
            reject(error);
        }
    });
}

var getOrganizationsOfUser = function getOrganizationsOfUser(userAPIKey) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Obteniendo organizaciones');
            //Mandatory fields
            var httpRequestOptions = {
                host: 'miv-aodfront-01.aragon.local',
                port: 5000,
                path: '/api/action/organization_list_for_user',
                method: constants.HTTP_REQUEST_METHOD_GET,
                headers: {
                    'Authorization': userAPIKey.accessKey
                }
            };

            http.get(httpRequestOptions, function (results) {
                var body = '';
                results.on('data', function (chunk) {
                    body += chunk;
                });
                results.on('end', function () {
                    // res.json(body);
                    resolve(body);
                });
            }).on('error', function (err) {
                logger.error(err);
                reject(err);

            });
        } catch (error) {
            reject(error);
        }
    });
}


/** GET ORGANIZATIONS BY USER */
router.get('/user/:userID/organizations', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de organizaciones para el usuario');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.ORGANIZATIONS_LIST_FOR_USER;
        let serviceRequestUrl = serviceBaseUrl + serviceName;

        if (req.params.userID != '') {
            getUserAPIKey(req.params.userID)
                .then(userAPIKey => {
                    logger.info('API KEY del usuario recuperada');
                    getOrganizationsOfUser(userAPIKey)
                        .then(getOrganizationResponse => {
                            logger.info('Respuesta de CKAN success: ' + getOrganizationResponse.success);
                            if (getOrganizationResponse) {
                                res.json(getOrganizationResponse);
                            } else {
                                logger.error('OBTENER Organizaciones - Error al obtener las organizaciones de CKAN: ' + JSON.stringify(getOrganizationResponse));
                                var errorJson = {
                                    'status': constants.REQUEST_ERROR_BAD_DATA,
                                    'error': 'OBTENER Organizaciones - Error al obtener las organizaciones de CKAN',
                                };
                                if (getOrganizationResponse && getOrganizationResponse != null
                                    && getOrganizationResponse.error && getOrganizationResponse.error != null
                                    && getOrganizationResponse.error.name && getOrganizationResponse.error.name != null) {
                                    errorJson.message = getOrganizationResponse.error.name;
                                }
                                res.json(errorJson);
                                return;
                            }
                        }).catch(error => {
                            console.log(error);
                            logger.error('ALTA DE USUARIOS - Error al insertar al usuario en base de datos: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Error al insertar al usuario en base de datos' });
                            return;
                        });
                }).catch(error => {
                    logger.error('OBTENER ORGANIZACIONES POR USUARIO - Usuario no autorizado: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_FORBIDDEN, 'error': 'OBTENER ORGANIZACIONES POR USUARIO - Usuario no autorizado' });
                    return;
                });
        } else {
            logger.error('OBTENER ORGANIZACIONES POR USUARIO - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'OBTENER ORGANIZACIONES POR USUARIO - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('Error in route /user/:userName/organizations');
        console.log(error);
    }
});

var getUserDetails = function getUserDetails(userAPIKey, userName) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Obteniendo detalles usuario');
            //Mandatory fields
            var httpRequestOptions = {
                host: 'miv-aodfront-01.aragon.local',
                port: 5000,
                path: '/api/action/user_show?id=' + userName,
                method: constants.HTTP_REQUEST_METHOD_GET,
                headers: {
                    'Authorization': userAPIKey.accessKey
                }
            };

            http.get(httpRequestOptions, function (results) {
                    var body = '';
                    results.on('data', function (chunk) {
                        body += chunk;
                    });
                    results.on('end', function () {
                        // res.json(body);
                        resolve(body);
                    });
                }).on('error', function (err) {
                    logger.error(err);
                    reject(err);

                });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = router;
