const express = require('express');
const router = express.Router();
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
        const query = {
            text: dbQueries.DB_ADMIN_GET_USERS_JSON,
            rowMode: constants.SQL_RESULSET_FORMAT_JSON
        };

        pool.on('error', (error, client) => {
            logger.error('Error en la conexión con base de datos', err);
            process.exit(-1);
        });

        pool.connect((connError, client, done) => {
            done();
            if (connError) {
                logger.error(connError.stack);
                res.json({ status: 500, 'error': err });
                return;
            }
            client.query(query, (queryError, queryResult) => {
                done();
                if (queryError) {
                    logger.error(queryError.stack);
                    res.json({ status: 500, 'error': queryError });
                    return;
                } else {
                    res.json(queryResult.rows);
                }
            });
        });
    } catch (error) {
        logger.error('Error in users admin');
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
                                insertUserInManager(user, accessInfo, insertCkanResponse)
                                    .then(userId => {
                                        logger.info('Usuario asociado a rol: ' + userId);
                                        if (userId) {
                                            res.json({ 'status': constants.REQUEST_REQUEST_OK, 'id': userId });
                                            return;
                                        } else {
                                            logger.error('ALTA DE USUARIOS - No se ha podido insertar el usuario en base de datos');
                                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - No se ha podido insertar el usuario en base de datos' });
                                            return;
                                        }
                                    }).catch(error => {
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
                            logger.error('ALTA DE USUARIOS - Respuesta del servidor errónea: ' + error);
                            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Respuesta del servidor errónea' });
                            return;
                        });
                }).catch(error => {
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
        logger.error('ALTA DE USUARIOS - Error creando usuario');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error creando usuario' });
    }
});

router.put('/user', function(req, res, next) {
    try {
        //user_update

    } catch (error) {
        logger.error('EDICIÓN DE USUARIOS - Error editando usuario');
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error editando usuario' });
    }
});

//user_delete

var getUserPermissions = function checkUserPermissions(userId, userName) {
    return new Promise((resolve, reject) => {
        try {
            const query = {
                text: dbQueries.DB_ADMIN_GET_USER_APP_PERMISSIONS,
                values: [userId, userName, constants.APPLICATION_NAME_CKAN],
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };

            pool.on('error', (error, client) => {
                process.exit(-1);
                reject(error);
            });

            pool.connect((connError, client, done) => {
                done();
                if (connError) {
                    reject(connError.stack);
                }
                client.query(query, (queryError, queryResult) => {
                    done();
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

            logger.info('Datos a enviar: ' + JSON.stringify(create_user_post_data));
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
            reject(error);
        }
    });
}

var insertUserInManager = function insertUserInManager(user, userAccessInfo, ckanResponse) {
    return new Promise((resolve, reject) => {
        try {
            var apikey = ckanResponse.result.apikey;
            var password = user.password = SHA256(user.password).toString(CryptoJS.enc.Base64);
            var userRole = JSON.stringify(user.role[0]);
            var fullname = user.fullname != null ? user.fullname : '';
            var description = user.description != null ? user.description : '';
            var createdUserId = null;
            pool.on('error', (error, client) => {
                process.exit(-1);
                reject(error);
            });

            pool.connect((connError, client, done) => {
                const shouldAbort = (transactionRollbackError) => {
                    if (transactionRollbackError) {
                        logger.error('Error en transacción', transactionRollbackError.stack);
                        client.query('ROLLBACK', (rollbackError) => {
                            if (rollbackError) {
                                logger.error('Error en transacción', rollbackError.stack);
                            }
                            done();
                        })
                    }
                    return !!transactionRollbackError;
                }
                logger.notice('Se inicia la transacción de alta de usuario en base de datos AOD_MANAGER');
                client.query('BEGIN', (transactionQueryError) => {
                    if (shouldAbort(transactionQueryError)) {
                        reject(transactionQueryError);
                    }
                    const insertUserQuery = {
                        text: dbQueries.DB_ADMIN_INSERT_USER,
                        values: [user.name, password, user.email, user.active, description, fullname]
                    };
                    logger.notice('Se procede a insertar el usuario');
                    client.query(insertUserQuery, (insertUserQueryError, insertUserQueryResponse) => {
                        if (shouldAbort(insertUserQueryError)) {
                            reject(insertUserQueryError);
                        }
                        logger.notice('Usuario insertado con id: ' + insertUserQueryResponse.rows[0].id);
                        const insertPermissionsQuery = {
                            text: dbQueries.DB_ADMIN_INSERT_USER_APP_PERMISSION,
                            values: [insertUserQueryResponse.rows[0].id, userAccessInfo.applicationId, apikey]
                        };
                        logger.notice('Se proceden a insertar los permisos del usuario');
                        client.query(insertPermissionsQuery, (insertPermissionsQueryError, insertPermissionsQueryResponse) => {
                            if (shouldAbort(insertPermissionsQueryError)) {
                                reject(insertPermissionsQueryError);
                            }
                            logger.notice('Se procede a asignar al usuario con el rol: ' + userRole);
                            const insertUserRoleQuery = {
                                text: dbQueries.DB_ADMIN_INSERT_USERS_ROLES,
                                values: [insertPermissionsQueryResponse.rows[0].id_user, userRole]
                            };
                            client.query(insertUserRoleQuery, (insertUserRoleQueryError, insertUserRoleQueryResponse) => {
                                if (shouldAbort(insertUserRoleQueryError)) {
                                    reject(insertUserRoleQueryError);
                                }
                                logger.notice('Role del usuario insertado');
                                client.query('COMMIT', (commitError) => {
                                    if (commitError) {
                                        logger.error('commit error');
                                    }
                                    done();
                                    logger.notice('Transacción completada para el usuario: ' + insertUserRoleQueryResponse.rows[0].id_user);
                                    resolve(insertUserRoleQueryResponse.rows[0].id_user);
                                });
                            });
                        });
                    });
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = router;
