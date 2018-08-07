//region Libraries
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

//endregion

//region get
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

router.get(constants.API_URL_ADMIN_CAMPUS_ENTRIES_BY_EVENT + "/:id", function (req, res, next) {
    var id = req.params.id;

    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_ENTRIES_BY_EVENT,
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

router.get(constants.API_URL_ADMIN_CAMPUS_ENTRIES + "/:id", function (req, res, next) {
    var id = req.params.id;

    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_ENTRY,
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
                var send;
                if (result.rows.length != 0) {
                    send = Object.assign({}, result.rows[0]);
                    delete send["topic_id"];
                    delete send["topics_name"];
                    var aux_Topcis = [];
                    console.log(result.rows);
                    result.rows.forEach((element, index) => {
                        aux_Topcis.push({ id: element.topic_id, name: element.topic_name });
                        delete result.rows[index]["topic_id"];
                        delete result.rows[index]["topics_name"];
                    });
                    send["topics"] = aux_Topcis;
                } else {
                    send = result.rows;
                }
                console.log(send);
                res.json(send);
            }
        });
    });
});

router.get(constants.API_URL_ADMIN_CAMPUS_ENTRIES, function (req, res, next) {
    var id = req.params.id;

    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_ENTRIES,
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

//endregion

//region Events
router.post(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;

    if (!content.name || !content.site_id) {
        logger.error('Input Error', 'name or site_name not found');
        res.json({ status: 400, error: 'Incorrect Input, name or site_name not found' });
        return;
    }

    var date = new Date().toISOString();

    createEventInCampus(content.name, content.description, content.site_id, date).then(createEvent => {
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

    updateEventInCampus(content.name, content.description, content.site_id, id).then(updateEvent => {
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


//region CreateEventInCampus
var createEventInCampus = function createEventInCampus(name, description, site_id, date) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                const shouldAbort = (err) => {
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.error('Error rolling back client', err.stack)
                            }
                            done();
                        })
                    }
                    return !!err;
                }
                logger.notice('Se inicia la transacción de insercion de un nuevo evento en base de datos CAMPUS');

                const queryEvent = {
                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_EVENTS,
                    values: [name, description, date]
                };

                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                    } else {
                        client.query(queryEvent, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                reject(err);
                            } else {
                                logger.notice('Se procede a la insercion de la tabla relacional Sites-Events');
                                const query_events_sites = {
                                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_EVENTS_SITES,
                                    values: [resultEvent.rows[0].id, resultSites.site_id]
                                };
                                client.query(query_events_sites, (err, result) => {
                                    if (shouldAbort(err)) {
                                        reject(err);
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
                });
            });
        } catch (error) {
            logger.error('Error borrando evento:', error);
            reject(error);
        }
    });
}
//endregion

//region updateEventInCampus

var updateEventInCampus = function updateEventInCampus(name, description, site_id, id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                const shouldAbort = (err) => {
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.error('Error rolling back client', err.stack)
                            }
                            done();
                        })
                    }
                    return !!err;
                }
                logger.notice('Se inicia la transacción de actualizacion de un nuevo evento en base de datos CAMPUS');

                const queryEvent = {
                    text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_EVENTS,
                    values: [name, description, id]
                };
                client.query('BEGIN', (err) => {
                    client.query(queryEvent, (err, resultEvent) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            logger.notice('Se procede a la actualizacion de site');
                            const querySites = {
                                text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_EVENTS_SITES,
                                values: [site_id, id]
                            };
                            client.query(querySites, (err, resultSites) => {
                                if (shouldAbort(err)) {
                                    reject(err);
                                } else {
                                    logger.notice('Evento actualizado');
                                    client.query('COMMIT', (commitError) => {
                                        done();
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
            });
        } catch (error) {
            logger.error('Error borrando evento:', error);
            reject(error);
        }
    });
};
//endregion

//endregion

//region Entries

router.post(constants.API_URL_ADMIN_CAMPUS_ENTRIES, upload.single('thumbnail'), function (req, res, next) {

    var content = req.body;

    if (!content.title || content.title == "") {
        logger.error('Input Error', 'Incorrect input, title required');
        res.json({ status: 400, error: 'Incorrect Input, title required' });
        return;
    }

    if (!content.type || !content.platform || !content.format || !content.event || !content.id_topic || !content.id_speaker) {
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }

    createEntryInCampus(content.title, content.description, content.url, req.file, content.format,
        content.type, content.platform, content.event, content.id_topic, content.id_speaker).then(createEvent => {
            if (createEvent) {
                logger.info('CREACION DE ENTRY - Entry creado correctamente')
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'CREACION DE ENTRY - Entry creado correctamente'
                });
            } else {
                logger.error('CREACION DE ENTRY - Error al crear el entry en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE ENTRY - Error al crear el entry en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('CREACION DE ENTRY - Error al crear el entry en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE ENTRY - Error al crear el entry en base de datos' });
            return;
        });
});


router.put(constants.API_URL_ADMIN_CAMPUS_ENTRIES, function (req, res, next) {

    var content = req.body;
    var id = content.id;

    if ((content.title && !content.title === "") || !id) {
        logger.error('Input Error', 'Incorrect input');
        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    updateEntryInCampus(content.title, content.description, content.url, req.file, content.format,
        content.type, content.platform, content.event, content.id_topic, content.id_speaker, id).then(updateEvent => {
            if (updateEvent) {
                logger.info('ACTUALIZACION DE ENTRY - Entry actualizado correctamente');
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'ACTUALIZACION DE ENTRY - Entry actualizado correctamente'
                });
            } else {
                logger.error('ACTUALIZACION DE ENTRY - Error al actualizar el entry en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE ENTRY - Error al actualizar el entry en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('ACTUALIZACIÓN DE ENTRY - Error al actualizar el entry en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACIÓN DE ENTRY - Error al actualizar el entry en base de datos' });
            return;
        });
});


//region createEntityInCampus
var createEntryInCampus = function createEntryInCampus(title, description, url, file, format,
    type, platform, event, id_topic, id_speaker) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                const shouldAbort = (err) => {
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.error('Error rolling back client', err.stack)
                            }
                            done();
                        })
                    }
                    return !!err;
                }
                logger.notice('Se inicia la transacción de insercion de un nuevo evento en base de datos CAMPUS');

                const queryEntry = {
                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_ENTRIES,
                    values: [title, description, url, file, format, type, platform, event]
                };

                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                    } else {
                        client.query(queryEntry, (err, resultEntry) => {
                            if (shouldAbort(err)) {
                                reject(err);
                            } else {
                                logger.notice('Se procede a la insercion de la tabla relacional Contents-Topics');
                                const query_contents_topics = {
                                    text: dbQueries.DB_ADMIN_INSERT_CAMPUS_CONTENTS_TOPICS,
                                    values: [resultEntry.rows[0].id, id_topic]
                                };
                                client.query(query_contents_topics, (err, result) => {
                                    if (shouldAbort(err)) {
                                        reject(err);
                                    } else {
                                        logger.notice('Se procede a la insercion de la tabla relacional Contents-Speakers');
                                        const query_contents_speakers = {
                                            text: dbQueries.DB_ADMIN_INSERT_CAMPUS_CONTENTS_SPEAKERS,
                                            values: [resultEntry.rows[0].id, id_speaker]
                                        };
                                        client.query(query_contents_speakers, (err, result) => {
                                            if (shouldAbort(err)) {
                                                reject(err);
                                            } else {
                                                logger.notice('Entry insertado');
                                                client.query('COMMIT', (commitError) => {
                                                    done()
                                                    if (commitError) {
                                                        reject(commitError);
                                                    } else {
                                                        logger.notice('Insercion de entry completada');
                                                        resolve(true);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('Error borrando entity:', error);
            reject(error);
        }
    });
}
//endregion

//region updateEntryInCampus

var updateEntryInCampus = function updateEntryInCampus(title, description, url, file, format,
    type, platform, event, id_topic, id_speaker, id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                const shouldAbort = (err) => {
                    if (err) {
                        client.query('ROLLBACK', (err) => {
                            if (err) {
                                console.error('Error rolling back client', err.stack)
                            }
                            done();
                        })
                    }
                    return !!err;
                }
                logger.notice('Se inicia la transacción de actualizacion de un entry en base de datos CAMPUS');

                const queryEntry = {
                    text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_ENTRIES,
                    values: [title, description, url, file, format,
                        type, platform, event, id]
                };
                client.query('BEGIN', (err) => {
                    client.query(queryEntry, (err, resultEntry) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            logger.notice('Se procede a la actualizacion de topics');
                            const queryTopics = {
                                text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_ENTRIES_TOPICS,
                                values: [id_topic, id]
                            };
                            client.query(queryTopics, (err, resultSites) => {
                                if (shouldAbort(err)) {
                                    reject(err);
                                } else {
                                    logger.notice('Se procede a la actualizacion de speakers');
                                    const querySpeakers = {
                                        text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_ENTRIES_SPEAKERS,
                                        values: [id_speaker, id]
                                    };
                                    client.query(querySpeakers, (err, resultSpeakers) => {
                                        if (shouldAbort(err)) {
                                            reject(err);
                                        } else {
                                            logger.notice('Evento actualizado');
                                            client.query('COMMIT', (commitError) => {
                                                done();
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
                            });
                        }
                    })
                });
            });
        } catch (error) {
            logger.error('Error borrando evento:', error);
            reject(error);
        }
    });
};
//endregion

//endregion


module.exports = router; 