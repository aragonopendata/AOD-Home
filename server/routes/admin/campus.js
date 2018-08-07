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
const multer = require('multer')
var storage = multer.memoryStorage()
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let path = '../../../assets/public/contenido-general/apps';
            if (fs.existsSync(path + file.originalname)) {
                fs.remove(path + file.originalname);
            }
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            callback(null, file.originalname);
        }
    })
});
// FormData for send form-data
const formData = require('form-data');
const fs = require('fs-extra');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);


router.get(constants.API_URL_ADMIN_CAMPUS_SITES, function (req, res, next) {
    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_SITES,
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_ADMIN_CAMPUS_SPEAKERS, function (req, res, next) {
    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_SPEAKERS,
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_ADMIN_CAMPUS_TOPICS, function (req, res, next) {
    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_TOPICS,
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.get(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_EVENTS,
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.post(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;

    if (!content.name || !content.site_name) {
        logger.error('Input Error', 'name or site_name not found');
        res.json({ status: 400, error: 'Incorrect Input, name or site_name not found' });
        return;
    }

    var date = new Date().toISOString();

    createEventInCampus(content.name, content.description, content.site_name, date).then(createEvent => {
        if (createEvent) {
            logger.info('CREACION DE EVENTO - Evento creado correctamente')
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'CREACION DE EVENTO - Evento creado correctamente'
            });
        } else {
            logger.error('CREACION DE EVENTO - Error al crear el evento en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE EVENTO - Error al crear el evento en base de datos' });
            return;
        }
    }).catch(error => {
        logger.error('CREACION DE EVENTO - Error al crear el evento en base de datos: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE EVENTO - Error al crear el evento en base de datos' });
        return;
    });

});

router.put(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
    var id = content.id;

    if ((!content.name && !content.description) || !id || content.name == "") {
        logger.error('Input Error', 'Incorrect input');
        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    updateEventInCampus(content.name, content.description, content.site_name, id).then(updateEvent => {
        if (updateEvent) {
            logger.info('ACTUALIZACION DE EVENTO - Evento actualizado correctamente')
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'ACTUALIZACION DE EVENTO - Evento actualizado correctamente'
            });
        } else {
            logger.error('ACTUALIZACION DE EVENTO - Error al actualizar el evento en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE EVENTO - Error al actualizar el evento en base de datos' });
            return;
        }
    }).catch(error => {
        logger.error('ACTUALIZACIÓN DE EVENTO - Error al actualizar el evento en base de datos: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE EVENTO - Error al actualizar el evento en base de datos' });
        return;
    });

});


router.get(constants.API_URL_ADMIN_CAMPUS_ENTRIES + "/:id", function (req, res, next) {
    var id = req.params.id;

    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_ENTRIES,
        values: [id],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });

});
router.post(constants.API_URL_ADMIN_CAMPUS_ENTRIES, upload.single('thumbnail'), function (req, res, next) {

    var content = req.body;

    if (!content.title || content.title == "") {
        logger.error('Input Error', 'Incorrect input, title required');
        res.json({ status: 400, error: 'Incorrect Input, title required' });
        return;
    }

    const query = {
        text: dbQueries.DB_ADMIN_INSERT_CAMPUS_ENTRIES,
        values: [content.title, content.description, content.url, req.file, content.format, content.type, content.platform, content.event]
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Nueva entrada creada');
                res.json({ 'status': constants.REQUEST_REQUEST_OK, message: "Entrada creada" });
            }
        });
    });
});


router.put(constants.API_URL_ADMIN_CAMPUS_ENTRIES, function (req, res, next) {
    var content = req.body;
    var id = content.id;

    if ((content.title && content.title == '') || !id) {
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }

    const query = {
        text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_ENTRIES,
        values: [content.title, content.description, content.url, req.file,
        content.format, content.type, content.platform, content.event, id],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': err });
                return;
            } else {
                logger.info('Evento Actualizado');
                res.json({ 'status': constants.REQUEST_REQUEST_OK, message: "Evento Actualizado" });
            }
        });
    });

});

var createEventInCampus = function createEventInCampus(name, description, site_name, date) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                    })
                }
                logger.notice('Se inicia la transacción de insercion de un nuevo evento en base de datos CAMPUS');

                const queryEvent = {
                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_EVENTS,
                    values: [name, description, date]
                };

                client.query(queryEvent, (errEvent, resultEvent) => {
                    if (errEvent) {
                        reject(errEvent);
                    } else {
                        logger.notice('Se procede a la insercion de un nuevo site');
                        const querySites = {
                            text: dbQueries.DB_ADMIN_INSERT_CAMPUS_SITES,
                            values: [site_name]
                        };
                        client.query(querySites, (errSites, resultSites) => {
                            if (errSites) {
                                reject(errSites);
                            } else {
                                logger.notice('Se procede a la insercion de la tabla relacional Sites-Events');
                                const query_events_sites = {
                                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_EVENTS_SITES,
                                    values: [resultEvent.rows[0].id, resultSites.rows[0].id]
                                };
                                client.query(query_events_sites, (err_events_sites, result) => {
                                    if (err_events_sites) {
                                        reject(err_events_sites);
                                    } else {
                                        logger.notice('Evento insertado');
                                        client.query('COMMIT', (commitError) => {
                                            done()
                                            if (commitError) {
                                                reject(commitError);
                                            } else {
                                                logger.notice('Insercion del evento completada');
                                                resolve(true);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            });
        } catch (error) {
            logger.error('Error borrando evento:', error);
            reject(error);
        }
    });
}


var updateEventInCampus = function updateEventInCampus(name, description, site_name, id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((connError, client, done) => {
                if (connError) {
                    logger.error('Error en transacción', transactionRollbackError.stack);
                    client.query('ROLLBACK', (rollbackError) => {
                        if (rollbackError) {
                            logger.error('Error en transacción', rollbackError.stack);
                        }
                    })
                }
                logger.notice('Se inicia la transacción de actualizacion de un nuevo evento en base de datos CAMPUS');
                
                const queryEvent = {
                    text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_EVENTS,
                    values: [name, description, id]
                };

                client.query(queryEvent, (errEvent, resultEvent) => {
                    if (errEvent) {
                        reject(errEvent);
                    } else {
                        logger.notice('Se procede a la actualizacion de site');
                        const querySites = {
                            text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_SITES,
                            values: [site_name, id]
                        };
                        client.query(querySites, (errSites, resultSites) => {
                            if (errSites) {
                                reject(errSites);
                            } else {
                                logger.notice('Evento actualizado');
                                client.query('COMMIT', (commitError) => {
                                    done()
                                    if (commitError) {
                                        reject(commitError);
                                    } else {
                                        logger.notice('Actualización del evento completada');
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    }
                })
            });
        } catch (error) {
            logger.error('Error borrando evento:', error);
            reject(error);
        }
    });
}

module.exports = router; 