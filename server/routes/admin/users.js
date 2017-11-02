const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const http = require('http');
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
            && user.email != '' && user.password != '' && user.active != '') {
            var requestUserId = user.requestUserId;
            var requestUserName = user.requestUserName;
            //1. CHEKING PERMISSIONS OF THE USER WHO MAKES THE REQUEST
            var userAccessInfo = checkUserPermissions(requestUserId, requestUserName);
             
            if (userAccessInfo) {
                //2. INSERTING USER IN CKAN
                var ckanResponse = insertUserInCkan(userAccessInfo, user);
                if (ckanResponse && ckanResponse.success == 'true') {
                    //3. INSERTING USER IN AOD_MANAGER AND ASSIGNING PERMISSIONS
                    var createdUserId = insertUserInManager(user, userAccessInfo, ckanResponse);
                    if (createdUserId) {
                        logger.info();
                        res.json({ status: constants.REQUEST_REQUEST_OK, 'id': createdUserId });
                        return;
                    } else {
                        logger.error('ALTA DE USUARIOS - Respuesta del servidor errónea: ' + JSON.stringify(ckanResponse));
                        res.json({ status: constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error de inserción en base de datos' });
                        return;
                    }
                } else {
                    logger.error('ALTA DE USUARIOS - Respuesta del servidor errónea: ' + JSON.stringify(ckanResponse));
                    res.json({ status: constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Respuesta del servidor errónea' });
                    return;
                }
            } else {
                logger.error('ALTA DE USUARIOS - Usuario no autorizado');
                res.json({ status: constants.REQUEST_ERROR_FORBIDDEN, 'error': 'ALTA DE USUARIOS - Usuario no autorizado' });
                return;
            }
        } else {
            logger.error('ALTA DE USUARIOS - Parámetros incorrectos');
            res.json({ status: constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE USUARIOS - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('ALTA DE USUARIOS - Error creando usuario');
        res.json({ status: constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE USUARIOS - Error creando usuario' });
    }
});

function checkUserPermissions(userId, userName) {
    try {
        var userAccessInfo = null;
        const query = {
            text: dbQueries.DB_ADMIN_GET_USER_APP_PERMISSIONS,
            values: [userId, userName, constants.APPLICATION_NAME_CKAN],
            rowMode: constants.SQL_RESULSET_FORMAT_JSON
        };

        pool.on('error', (error, client) => {
            logger.error('Error en la conexión con base de datos', err);
            process.exit(-1);
            return null;
        });

        pool.connect((connError, client, done) => {
            done();
            if (connError) {
                logger.error(connError.stack);
                return null;
            }
            client.query(query, (queryError, queryResult) => {
                done();
                if (queryError) {
                    logger.error(queryError.stack);
                    return null;
                } else {
                    logger.info('Permisos de usuario sin bucle: ' + JSON.stringify(queryResult.rows));
                    userAccessInfo = queryResult.rows[0];
                    logger.info('Permisos de usuario dentro del método: ' + JSON.stringify(userAccessInfo));
                }
            });
        });
    } catch (error) {
        logger.error('Error al obtener los permisos de acceso del usuario');
        return null;
    }
    return userAccessInfo;
}

function insertUserInCkan(userAccessInfo, user) {
    try {
        logger.debug('Tracking datasets...');
        //Mandatory fields
        var create_user_post_data = querystring.stringify({
            'name': user.name,
            'email': user.email,
            'password': user.password
        });
        //Optional fields
        if (user.fullname != '') {
            create_user_post_data.fullname = user.fullname;
        }
        if (user.description != '') {
            create_user_post_data.description = user.description;
        }
        logger.debug('Parámetros de la llamada: ' + create_user_post_data);

        var create_user_post_options = {
            host: constants.CKAN_BASE_URL,
            port: constants.CKAN_BASE_PORT,
            path: constants.CKAN_URL_PATH_USER_CREATE,
            method: constants.HTTP_REQUEST_METHOD_POST,
            headers: {
                'Content-Type': constants.HTTP_REQUEST_HEADER_CONTENT_TYPE_JSON,
                'Content-Length': Buffer.byteLength(create_user_post_data),
                'User-Agent': constants.HTTP_REQUEST_HEADER_USER_AGENT_NODE_SERVER_REQUEST,
                'Authorization': userAccessInfo.accessKey
            }
        }
        logger.debug('Configuraćión llamada POST: ' + create_user_post_options);

        var post_request = http.request(create_user_post_options, function (results) {
            results.setEncoding(constants.HTTP_RESPONSE_DATA_ENCODING);
            var serviceResponse = '';
            results.on('data', function (chunk) {
                serviceResponse += chunk;
            });
            results.on('end', function () {
                var serviceResponseString = JSON.stringify(serviceResponse);
                logger.info('Respuesta del servicio: ' + serviceResponseString);
                return serviceResponseString;
            });
        }).on('error', function (err) {
            logger.debug('Error al crear usuario: ' + err);
            return null;
        });
        logger.debug('Escribiendo POST');
        post_request.write(create_user_post_data);
        logger.debug('Usuario creado');
        post_request.end();
    } catch (error) {
        logger.debug('Error al crear usuario: ' + error);
        return null;
    }
}

function insertUserInManager(user, userAccessInfo, ckanResponse) {
    try {
        var apikey = ckanResponse.result.apikey;
        var password = user.password = SHA256(user.password).toString(CryptoJS.enc.Base64);
        var fullname = user.fullname != null ? user.fullname : '';
        var description = user.description != null ? user.description : '';
        
        pool.on('error', (error, client) => {
            logger.error('Error en la conexión con base de datos', err);
            process.exit(-1);
            return;
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

            client.query('BEGIN', (transactionQueryError) => {
                if (shouldAbort(err)) {
                    return;
                }
                const insertUserQuery = {
                    text: dbQueries.DB_ADMIN_INSERT_USER,
                    values: [user.name, password, user.email, user.active, description, fullname]
                };
                logger.notice('Se procede a insertar el usuario');
                client.query(insertUserQuery, (insertUserQueryError, insertUserQueryResponse) => {
                    if (shouldAbort(err)) {
                        return;
                    }
                    logger.notice('Usuario insertado con id: ' + insertUserQueryResponse.createdUserId);
                    const insertPermissionsQuery = {
                        text: dbQueries.DB_ADMIN_INSERT_USER_APP_PERMISSION,
                        values: [insertUserQueryResponse.createdUserId, userAccessInfo.applicationId, apikey]
                    };
                    logger.notice('Se proceden a insertar los permisos del usuario');
                    client.query(insertPermissionsQuery, (insertPermissionsQueryError, insertPermissionsQueryResponse) => {
                        if (shouldAbort(err)) {
                            return;
                        }
                        client.query('COMMIT', (commitError) => {
                            if (commitError) {
                              logger.error('Error committing transaction: ', commitError.stack)
                            }
                            done();
                            logger.notice('Permisos del usuario insertados');
                            return insertPermissionsQueryResponse.createdUserId;
                        });
                    });
                });
            });
        });
    } catch (error) {
        logger.error('Error in users admin');
        return;
    }
}

module.exports = router;
