const express = require('express');
const router = express.Router();
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

router.get('/roles', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de roles');
        pool.connect(function (err, client, done) {
            const queryDb = {
                text: dbQueries.DB_ADMIN_GET_ROLES,
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };
            client.query(queryDb, function (err, result) {
                done();
                if (err) {
                    logger.error('LISTADO DE ROLES - Error obteniendo el listado 1: ', err);
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE ROLES - Error obteniendo el listado' });
                };
                res.json(result.rows);
            });
        });
    } catch (error) {
        logger.error('LISTADO DE ROLES - Error obteniendo el listado 2: ', error);
        return;
    };
});

router.get('/roles' + '/:roleId', function (req, res, next) {
    try {
        const query = {
            text: dbQueries.DB_ADMIN_GET_ROLE,
            rowMode: constants.SQL_RESULSET_FORMAT_JSON,
            values: [req.params.datasetName]
        };

        pool.on('error', (error, client) => {
            logger.error('Error en la conexión con base de datos', error);
            process.exit(-1);
            res.json({ status: 500, 'error': error });
            return;
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
                    res.json({ status: 500, 'error': queryError.stack });
                    return;
                } else {
                    res.json(queryResult.rows);
                }
            });
        });
    } catch (error) {
        logger.error('Error obteniendo rol');
        res.json({ status: 500, 'error': error });
        return;
    }
});

/** GET USERS OF A ROLE */
router.get('/roles/usersRole/:roleId', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de usuarios del rol');
        pool.connect(function (err, client, done) {
            const queryDb = {
                text: dbQueries.DB_ADMIN_GET_USERS_ROLE,
                rowMode: constants.SQL_RESULSET_FORMAT_JSON,
                values: [req.params.roleId]
            };
            client.query(queryDb, function (err, result) {
                done()
                if (err) {
                    logger.error('LISTADO DE USUARIOS DEL ROL - Error obteniendo el listado: ', err);
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER USUARIOS DEL ROL - Error obteniendo el listado' });
                }
                res.json(result.rows)
            })
        });
    } catch (error) {
        logger.error('LISTADO DE ROLES - Error obteniendo el listado: ', error);
        return;
    }
});


/** CREATE NEW ROLE */
router.post('/roles', function (req, res, next) {
    try {
        var role = req.body;
        logger.notice('Rol que llega desde request: ' + JSON.stringify(role));
        //0. CHECKING REQUEST PARAMETERS
        if (role.name != '' && role.description != '' && role.active != undefined) {
            //3. INSERTING USER IN AOD_MANAGER AND ASSIGNING PERMISSIONS
            insertRoleInManager(role).then(insertRoleInManagerResponse => {
                if(insertRoleInManagerResponse){
                    res.json({
                        'status': constants.REQUEST_REQUEST_OK,
                        'success': true,
                        'result': 'ALTA DE ROLES - Rol dado de alta correctamente'
                    });
                    logger.info('ALTA DE ROLES - Rol dado de alta correctamente');
                }else{
                    logger.error('ALTA DE ROLES - No se ha podido dar de alta el rol');
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE ROLES - No se ha podido dar de alta el rol' });
                    return;
                }
            });
        }
    } catch (error) {
        logger.error('ALTA DE ROLES - Error creando rol: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ALTA DE ROLES - Error creando rol' });
        return;
    }
});

/** UPDATE ROLE */
router.put('/roles/:roleId', function (req, res, next) {
    try {
        var role = req.body;
        if (role.name != '' && role.description != '' && role.active != undefined && req.params.roleId != '' && role.id == req.params.roleId) {
            updateRoleInManager(role).then(updateRoleInManager => {
                if (updateRoleInManager) {
                    logger.info('ACTUALIZACIÓN DE ROLES - Rol actualizado correctamente');
                    res.json({
                        'status': constants.REQUEST_REQUEST_OK,
                        'success': true,
                        'result': 'ACTUALIZACIÓN DE ROLES - Rol actualizado correctamente'
                    });
                } else {
                    logger.error('ACTUALIZACIÓN DE ROLES - Error al actualizar el rol de la base de datos: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE ROLES - Error al actualizar el rol de la base de datos' });
                }
            }).catch(error => {
                logger.error('ACTUALIZACIÓN DE ROLES - Error al actualizar el rol en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE ROLES - Error al actualizar el rol en base de datos' });
                return;
            });
        } else {
            logger.error('ACTUALIZACIÓN DE ROLES - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ACTUALIZACIÓN DE ROLES - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('Error obteniendo rol');
        res.json({ status: 500, 'error': error });
        return;
    }
});


/** DELETE ROLE */
router.delete('/roles/:roleId', function (req, res, next) {
    try {
        var roleName = req.body.name;
        var roleIdDb = req.params.roleId;
        //0. CHECKING REQUEST PARAMETERS
        if ((roleName != '' && roleName != undefined) && (roleIdDb != '' && roleIdDb != undefined)) {
            deleteRoleInManager(roleIdDb).then(deleteRoleInManagerResponse => {
                if (deleteRoleInManagerResponse) {
                    logger.info('Rol borrado de BBDD');
                    res.json({
                        'status': constants.REQUEST_REQUEST_OK,
                        'success': true,
                        'result': 'BORRADO DE ROLES - Rol borrado correctamente'
                    });
                } else {
                    logger.error('BORRADO DE ROLES - Error al borrar el rol de la base de datos: ');
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE ROLES - Error al borrar el rol de la base de datos' });
                    return;
                }
            }).catch(error => {
                logger.error('BORRADO DE ROLES - Error al borrar el rol de la base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE ROLES - Error al borrar el rol de la base de datos' });
                return;
            });
        } else {
            logger.error('BORRADO DE ROLES - Parámetros incorrectos');
            res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, 'error': 'ALTA DE ROLES - Parámetros incorrectos' });
            return;
        }
    } catch (error) {
        logger.error('BORRADO DE ROLES - Error borrando rol', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE ROLES - Error borrando rol' });
        return;
    }
});

var insertRoleInManager = function insertRoleInManager(role) {
    return new Promise((resolve, reject) => {
        try {

            var name = role.name;
            var description = role.description;
            var active = role.active;

            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                    })
                }
                logger.notice('Se inicia la transacción de alta de rol en base de datos AOD_MANAGER');

                const insertRoleQuery = {
                    text: dbQueries.DB_ADMIN_INSERT_ROLE,
                    values: [name, description, active]
                };

                client.query(insertRoleQuery, (insertRoleQueryError, insertRoleQueryResponse) => {
                    if (insertRoleQueryError) {
                        reject(insertRoleQueryError);
                    } else {
                        logger.notice('Nuevo Rol insertado');
                        client.query('COMMIT', (commitError) => {
                            done();
                            if (commitError) {
                                reject(commitError);
                            } else {
                                logger.notice('Rol insertado correctamente');
                                resolve(true);
                            };
                        });
                    }
                })
            });
        } catch (error) {
            logger.error('Error insertando rol en base de datos:', error);
            reject(error);
        }
    });
}

var updateRoleInManager = function updateRoleInManager(role) {
    return new Promise((resolve, reject) => {
        try {
            var name = role.name != null ? role.name : '';
            var description = role.description != null ? role.description : '';
            var active = role.active != null ? role.active : false;
            var roleId = role.id;

            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                    })
                }
                logger.notice('Se inicia la transacción de actualización de rol en base de datos AOD_MANAGER');

                const updateRoleQuery = {
                    text: dbQueries.DB_ADMIN_UPDATE_ROLE,
                    values: [name, description, active,roleId]
                };

                client.query(updateRoleQuery, (updateRoleQueryError, updateRoleQueryResponse) => {
                    if (updateRoleQueryError) {
                        reject(updateRoleQueryError);
                    } else {
                        logger.notice('Rol insertado');
                        client.query('COMMIT', (commitError) => {
                            done()
                            if (commitError) {
                                reject(commitError);
                            } else {
                                logger.notice('Actualización del rol completada');
                                resolve(true);
                            }
                        });
                    }
                })
            });
        } catch (error) {
            logger.error('Error actualizando rol en Base de Datos:', error);
            reject(error);
        }
    });
}

var deleteRoleInManager = function deleteRoleInManager(role) {
    return new Promise((resolve, reject) => {
        try {
            var id = role;
            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                    })
                }
                logger.notice('Se inicia la transacción de borrado de usuario en base de datos AOD_MANAGER');

                const deleteRoleQuery = {
                    text: dbQueries.DB_ADMIN_DELETE_ROLE,
                    values: [id]
                };
                client.query(deleteRoleQuery, (deleteRoleQueryError, deleteRoleQueryResponse) => {
                    if (deleteRoleQueryError) {
                        reject(deleteRoleQueryError);
                    } else {
                        logger.notice('Borrado de rol realizado con exito.');
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            logger.error('Error borrando rol en base de datos:', error);
            reject(error);
        }
    });
}

module.exports = router;
