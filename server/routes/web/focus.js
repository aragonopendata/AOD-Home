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

/**
 ********** SAVE ENTIRE HISTORY  **********
 */
router.post(constants.API_URL_FOCUS_SAVE_ENTIRE_HISTORY, function (req, res, next) {
    var content = req.body;

    //Comprobación sobre elementos de historia
    if (!correctNewHistory(content)) {
        logger.error('Input Error', ' title of the history or some part of content don found not found');
        res.json({ status: 400, error: 'Incorrect Input, title not found' });
        return;
    }

    try {
        //Se genera un token ÚNICO y NO EXISTENTE para la historia
        generateToken().then(id => {
            //Una vez se tiene el token, se guardará la historia en la BBDD
            createHistory(id, content.state , content.title, content.description ,content.email, content.id_reference, content.main_category, content.secondary_categories).then(createHistory => {
                if (createHistory) {
                    logger.info('CREACION DE UNA HISTORIA COMPLETA- Elemento historia (sin contenidos) en la base de datos creada correctamente')
                    //Si hay contenidos se guardarán, sino se habrá finalizado
                    if(content.contents){
                        //Una vez se crea la historia, se guardarán cada uno de los contenidos que lo acompañan
                        createContents(content.contents, 0, id).then(allCreate => {
                            //Si es true, se habrán generado correctamente tanto las historias, como sus contenidos
                            if (allCreate) {
                                logger.info('CREACION DE UNA HISTORIA COMPLETA- Contenidos de la historia creados en la base de datos creada correctamente')
                                logger.info('CREACION DE UNA HISTORIA COMPLETA- Historia completa creada en la base de datos creada correctamente')
                                res.json({
                                    'status': constants.REQUEST_REQUEST_OK,
                                    'success': true,
                                    'result': 'CREACION DE UNA HISTORIA COMPLETA- Contenido creado correctamente',
                                    'id': id
                                });
                            } else {
                                logger.error('CREACION DE UNA HISTORIA COMPLETA - Error al crear el contenido en base de datos: ', error);
                                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                                return;
                            }
                        }).catch(error => {
                            logger.error('CREACION DE UNA HISTORIA COMPLETA - Error al crear el contenido en base de datos: ', error);
                            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UN CONTENIDO- Error al crear el contenido en base de datos' });
                            return;
                        });
                    }else{
                        logger.info('CREACION DE UNA HISTORIA COMPLETA- Historia completa creada en la base de datos creada correctamente')
                        res.json({
                            'status': constants.REQUEST_REQUEST_OK,
                            'success': true,
                            'result': 'CREACION DE UNA HISTORIA- Historia creada correctamente',
                            'token': id
                        });
                    }
                } else{
                    logger.error('CREACION DE UNA HISTORIA COMPLETA - Error al crear el evento en base de datos: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                    return;
                }
            }).catch(error => {
                logger.error('CREACION DE UNA HISTORIA COMPLETA - Error al crear la historia en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                return;
            });
        }).catch(error => {
            logger.error('CREACION DE UNA HISTORIA COMPLETA - Error al crear el token/id de la historia historia: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACIÓN DE UNA HISTORIA VERIFICANDO TOKEN - Error al consultar si el token (id) existía previamente en base de datos' });
            return;
        });
    }catch (error) {
        logger.error('CREACION DE UNA HISTORIA COMPLETA - Error creando la nueva historia: ', error);
    }
});



/**
 ********** LIST HISTORIES **********
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, res, next) {
    try {
        listHistories().then(histories => {
            if (histories) {
                logger.info('LISTADO DE HISTORIAS- Listado de historias correcto')
                res.json(histories.rows);
            } else {
                logger.error('LISTADO DE HISTORIAS - Error al listar historias: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA- Error al crear la historia en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('LISTADO DE HISTORIAS - Error al listar historias: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
            return;
        });
        
    } catch (error) {
        logger.error('LISTADO DE HISTORIAS - Error obteniendo el listado: ', error);
    }
});


/**
 ********** LIST CONTENTS **********
 */
router.get(constants.API_URL_FOCUS_CONTENTS, function (req, res, next) {try {
    listContents().then(histories => {
        if (histories) {
            logger.info('LISTADO DE CONTENIDOS- Listado de contenidos correcto')
            res.json(histories.rows);
        } else {
            logger.error('LISTADO DE CONTENIDOS - Error al listar contenidos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDOS- Error al listar los contenidos de la base de datos' });
            return;
        }
    }).catch(error => {
        logger.error('LISTADO DE CONTENIDOS - Error al listar contenidos: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDOS- Error al listar los contenidos de la base de datos' });
        return;
    });
    
} catch (error) {
    logger.error('LISTADO DE CONTENIDOS - Error obteniendo el listado: ', error);
}
});


/**
 ********** LIST CONTENTS OF AN HISTORY**********
 */
router.get(constants.API_URL_FOCUS_CONTENTS_HISTORY, function (req, res, next) {
    var content = req.body;
    try {
        listContentHistories(content.id_history).then(contentHistories => {
            if (contentHistories) {
                logger.info('LISTADO DE CONTENIDO DE UNA HISTORIA- Listado de contenido de una historia correcto')
                res.json(contentHistories.rows);
            } else {
                logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error al listar los contenidos de una historia: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDO DE UNA HISTORIA - Error al consultar los contenidos de la historia en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error al listar los contenidos de una historia: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDO DE UNA HISTORIA - Error al consultar los contenidos de la historia en base de datos' });
            return;
        });
        
    } catch (error) {
        logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error obteniendo el listado: ', error);
    }
});

/**
 ********** LIST CONTENTS A SPECIFIC HISTORY**********
 */
router.get(constants.API_URL_FOCUS_HISTORY, function (req, res, next) {
    var content = req.body;
    try {
        listHistory(content.id_history).then(history => {
            if (history) {
                logger.info('LISTADO DE CONTENIDO DE UNA HISTORIA- Listado de contenido de una historia correcto')
                res.json(history.rows);
            } else {
                logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error al listar los contenidos de una historia: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDO DE UNA HISTORIA - Error al consultar los contenidos de la historia en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error al listar los contenidos de una historia: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'LISTADO DE CONTENIDO DE UNA HISTORIA - Error al consultar los contenidos de la historia en base de datos' });
            return;
        });
        
    } catch (error) {
        logger.error('LISTADO DE CONTENIDO DE UNA HISTORIA - Error obteniendo el listado: ', error);
    }
});


/**
 ********** SAVE NEW HISTORY **********
 */
router.post(constants.API_URL_FOCUS_SAVE_HISTORY, function (req, res, next) {
    var content = req.body;
    
    if (!correctNewHistory(content)) {
        logger.error('Input Error', ' title not found');
        res.json({ status: 400, error: 'Incorrect Input, title not found' });
        return;
    }

    try {
       generateToken().then(id => {
           createHistory(id, content.state , content.title, content.description ,content.email, content.id_reference, content.main_category, content.secondary_categories).then(createHistory => {
               if (createHistory) {
                   logger.info('CREACION DE UNA HISTORIA- Historia creada correctamente')
                   res.json({
                       'status': constants.REQUEST_REQUEST_OK,
                       'success': true,
                       'result': 'CREACION DE UNA HISTORIA- Historia creada correctamente',
                       'token': createHistory
                    });
                } else {
                    logger.error('CREACION DE UNA HISTORIA - Error al crear el evento en base de datos: ', error);
                    res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                    return;
                }
            }).catch(error => {
                logger.error('CREACION DE UNA HISTORIA - Error al crear la historia en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                return;
            });
        }).catch(error => {
            logger.error('CREACIÓN DE UNA HISTORIA VERIFICANDO TOKEN - Error al listar los contenidos de una historia: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACIÓN DE UNA HISTORIA VERIFICANDO TOKEN - Error al consultar si el token (id) existía previamente en base de datos' });
            return;
        });
    } catch (error) {
        logger.error('CREACION DE UNA HISTORIA - Error creando la historia: ', error);
    }
});

/**
 ********** SAVE NEW CONTENT **********
 */
router.post(constants.API_URL_FOCUS_SAVE_CONTENT, function (req, res, next) {
    var content = req.body;

    if (!content.title || !content.description || !content.id_graph || !content.id_history) {
        logger.error('Input Error', 'title, description, id_graph, id_history not found');
        res.json({ status: 400, error: 'Incorrect Input, title, description, id_graph, id_history not found' });
        return;
    }

    try {
        createContent(content.title, content.description, content.id_graph, content.id_history).then(createContent => {
            if (createContent) {
                logger.info('CREACION DE UN CONTENIDO- Contenido creado correctamente')
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'CREACION DE UN CONTENIDO- Contenido creado correctamente',
                    'id': createContent
                });
            } else {
                logger.error('CREACION DE UN CONTENIDO - Error al crear el contenido en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UNA HISTORIA - Error al crear la historia en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('CREACION DE UN CONTENIDO - Error al crear el contenido en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'CREACION DE UN CONTENIDO- Error al crear el contenido en base de datos' });
            return;
        });
        
    } catch (error) {
        logger.error('CREACION DE UN CONTENIDO - Error creando el contenido: ', error);
    }
});

/**
 ********** UPDATE HISTORY **********
 */
router.put(constants.API_URL_FOCUS_UPDATE_HISTORY, function (req, res, next) {
    var content = req.body;
    
    if (!content.id) {
        logger.error('Input Error', ' id not found');
        res.json({ status: 400, error: 'Incorrect Input, title not found' });
        return;
    }
    
    updateHistory(content.state , content.title, content.description , content.email, content.id, content.id_reference, content.main_category, content.secondary_categories).then(updateEvent => {
        if (updateEvent) {
            logger.info('ACTUALIZACION DE HISTORIA - Historia actualizada correctamente')
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'ACTUALIZACION DE HISTORIA - Historia actualizada correctamente'
            });
        } else {
            logger.error('ACTUALIZACION DE HISTORIA - Error al actualizar la historia en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACION DE HISTORIA - Error al actualizar la historia en base de datos' });
            return;
        }
    }).catch(error => {
        logger.error('ACTUALIZACION DE HISTORIA - Error al actualizar la historia en base de datos: ', error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACION DE HISTORIA - Error al actualizar la historia en base de datos' });
        return;
    });

});

/**
 ********** UPDATE CONTENT **********
 */
router.put(constants.API_URL_FOCUS_UPDATE_CONTENT, function (req, res, next) {
    var content = req.body;
    
    if (!content.id ) {
        logger.error('Input Error', 'id not found');
        res.json({ status: 400, error: 'Incorrect Input,  id not found' });
        return;
    }

    try {
        updateContent(content.title, content.description, content.id_graph, content.id_history, content.id).then(updateContent => {
            if (updateContent) {
                logger.info('ACTUALIZACION DE CONTENIDO - Contenido actualizada correctamente')
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'ACTUALIZACION DE CONTENIDO - Contenido actualizada correctamente'
                });
            } else {
                logger.error('ACTUALIZACION DE CONTENIDO - Error al actualizar el contenido en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACION DE CONTENIDO - Error al actualizar el contenido en base de datos' });
                return;
            }
        }).catch(error => {
            logger.error('ACTUALIZACION DE CONTENIDO - Error al actualizar el contenido en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'ACTUALIZACION DE CONTENIDO - Error al actualizar el contenido en base de datos' });
            return;
        });
        
    } catch (error) {
        logger.error('CREACION DE UN CONTENIDO - Error creando el contenido: ', error);
    }
});


/**
 ********** DELETE HISTORY **********
 */
router.delete(constants.API_URL_FOCUS_DELETE_HISTORY, function (req, res, next) {
    var content = req.body;

    if (!content.id) {
        logger.error('Input Error', 'id not found');
        res.json({ status: 400, error: 'Incorrect Input, id not found' });
        return;
    }
    try {
        deleteHistory(content.id).then(deleteHistory => {
            if (deleteHistory) {
                logger.info('BORRADO DE HISTORIA - Historia borrada correctamente')
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'BORRADO DE HISTORIA - Historia borrada correctamente'
                });
            } else {
                logger.error('BORRADO DE HISTORIA - Error al borrar la historia en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE HISTORIA - Historia borrada correctamente' });
                return;
            }
        }).catch(error => {
            logger.error('BORRADO DE HISTORIA - Error al borrar la historia en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE HISTORIA - Historia borrada correctamente'});
            return;
        });
        
    } catch (error) {
        logger.error('BORRADO DE HISTORIA  - Error borrando la historia: ', error);
    }
});

/**
 ********** DELETE CONTENT **********
 */
router.delete(constants.API_URL_FOCUS_DELETE_CONTENT, function (req, res, next) {
    var content = req.body;

    if (!content.id) {
        logger.error('Input Error', 'id not found');
        res.json({ status: 400, error: 'Incorrect Input, id not found' });
        return;
    }
    try {
        deleteContent(content.id).then(deleteContent => {
            if (deleteContent) {
                logger.info('BORRADO DE CONTENIDO - Contenido borrado correctamente')
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true,
                    'result': 'BORRADO DE CONTENIDO - Contenido borrado correctamente'
                });
            } else {
                logger.error('BORRADO DE CONTENIDO - Error al borrar el contenido en base de datos: ', error);
                res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE CONTENIDO - Contenido borrado correctamente' });
                return;
            }
        }).catch(error => {
            logger.error('BORRADO DE CONTENIDO - Error al borrar la contenido en base de datos: ', error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'BORRADO DE CONTENIDO - Contenido borrado correctamente'});
            return;
        });
        
    } catch (error) {
        logger.error('BORRADO DE CONTENIDO  - Error borrando el contenido: ', error);
    }
});



function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var listHistories = function listHistories() {
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
                logger.notice('Se inicia la transacción de obtención de las historias de la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_GET_HISTORIES,
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                };

                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo el listado: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }
                    resolve(result)
                });
            });
        
        } catch (error) {
            logger.error('Error listando historias:', error);
            reject(error);
        }
    });
};

var listHistory = function listHistory(id) {
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
                logger.notice('Se inicia la transacción de obtención de una historia de la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_GET_HISTORY,
                    values: [id],
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                };

                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo la historia: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }
                    resolve(result)
                });
            });
        
        } catch (error) {
            logger.error('Error obteniendo la historia:', error);
            reject(error);
        }
    });
};


var listContents = function listContents() {
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
                logger.notice('Se inicia la transacción de obtención de las historias de la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES,
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                };

                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo el listado: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }
                    resolve(result)
                });
            });
        
        } catch (error) {
            logger.error('Error listando historias:', error);
            reject(error);
        }
    });
};


var listContentHistories = function listContentHistories(id) {
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
                logger.notice('Se inicia la transacción de obtención de las historias de la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES_PARTICULAR_HISTORY,
                    values: [id],
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                };

                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo el listado: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }
                    resolve(result)
                });
            });
        
        } catch (error) {
            logger.error('Error listando historias:', error);
            reject(error);
        }
    });
};





var historyExist = function historyExist(id) {
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

                logger.notice('Se inicia la transacción de determinar si una historia existe en la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_EXIST_HISTORY,
                    values: [id]
                };
                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo el listado: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }else{
                        if(result.rowCount!=0){
                            resolve(true)
                        }else{
                            resolve(false)
                        }

                    }
                });
            });
        } catch (error) {
            logger.error('Error insertando historia:', error);
            reject(error);
        }
    });
}


var generateToken = function generateToken() {
    return new Promise((resolve, reject) => {
        try {
            var id= makeToken(10);
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

                logger.notice('Se inicia la transacción de determinar si una historia existe en la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_EXIST_HISTORY,
                    values: [id]
                };
                client.query(queryDb, function (err, result) {
                    done()
                    if (err) {
                        logger.error('OBTENER HISTORIA - Error obteniendo el listado: ', err);
                        resolve({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'OBTENER HISTORIA - Error obteniendo el listado' });
                    }else{
                        if(result.rowCount!=0){
                            resolve(generateToken())
                        }else{
                            resolve(id)
                        }
                    }
                });
            });
        } catch (error) {
            logger.error('Error insertando historia:', error);
            reject(error);
        }
    });
}



var createHistory = function createHistory(id, state , title, description , email, id_reference, main_category, secondary_categories ) {
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

                logger.notice('Se inicia la transacción de insercion de una nueva historia en la base de datos CAMPUS');

                const queryEvent = {
                    text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                    values: [id, state, title, description, email, id_reference, main_category, secondary_categories]
                };
                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                    } else {
                        client.query(queryEvent, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                reject(err);
                            } 
                            logger.notice('Historia insertada');
                            client.query('COMMIT', (commitError) => {
                                done()
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Insercion de la historia completada');
                                    //resolve(resultEvent.rows[0].id);
                                    resolve(true)
                                }
                            });
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('Error insertando historia:', error);
            reject(error);
        }
    });
}

var createContents = function createContents(contents,position, id_history) {
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

                logger.notice('Se inicia la transacción de insercion de un nuevo contenido en la base de datos CAMPUS');
                const queryEvent = {
                    text: dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY,
                    values: [contents[position].title, contents[position].description, contents[position].id_graph, id_history]
                };
                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                    } else {
                        client.query(queryEvent, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                reject(err);
                            } 
                            logger.notice('Contenido insertado');
                            client.query('COMMIT', (commitError) => {
                                done()
                                if (commitError) {
                                    reject(commitError);
                                } else if(((contents.length)-1)!=position){
                                    resolve(createContents(contents, (position+1), id_history));
                                } else {
                                    logger.notice('Insercion del contenido completada');
                                    resolve(true);
                                }
                            });
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('Error insertando contenido:', error);
            reject(error);
        }
    });
}


var createContent = function createContent(title, description, id_graph, id_history ) {
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

                logger.notice('Se inicia la transacción de insercion de un nuevo contenido en la base de datos CAMPUS');

                const queryEvent = {
                    text: dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY,
                    values: [title, description, id_graph, id_history]
                };
                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                    } else {
                        client.query(queryEvent, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                reject(err);
                            } 
                            logger.notice('Contenido insertado');
                            client.query('COMMIT', (commitError) => {
                                done()
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Insercion del contenido completada');
                                    resolve(resultEvent.rows[0].id);
                                }
                            });
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('Error insertando contenido:', error);
            reject(error);
        }
    });
    
}



var updateHistory = function updateHistory(state , title, description , email, id, id_reference,main_category, secondary_categories) {
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
                logger.notice('Se inicia la transacción de actualizacion de una historia en base de datos FOCUS');

                const queryEvent = {
                    text: dbQueries.DB_FOCUS_UPDATE_FOCUS_HISTORY,
                    values: [state, title, description, email, id_reference, main_category, secondary_categories, id]
                };

                client.query('BEGIN', (err) => {
                    client.query(queryEvent, (err, resultEvent) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Actualización de la historia completada');
                                    resolve(true);
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


var updateContent = function updateContent(title, description, id_graph, id_history, id) {
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
                logger.notice('Se inicia la transacción de actualizacion de una historia en base de datos FOCUS');

                const queryEvent = {
                    text: dbQueries.DB_FOCUS_UPDATE_FOCUS_CONTENTS_HISTORY,
                    values: [title, description, id_graph, id_history , id]
                };

                client.query('BEGIN', (err) => {
                    client.query(queryEvent, (err, resultEvent) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Actualización de la historia completada');
                                    resolve(true);
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


var deleteHistory = function deleteHistory(id) {
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
                logger.notice('Se inicia la transacción de borrado de una historia en base de datos FOCUS');

                const queryEvent = {
                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_HISTORY,
                    values: [id]
                };

                client.query('BEGIN', (err) => {
                    client.query(queryEvent, (err, resultEvent) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Borrado de la historia completada');
                                    resolve(true);
                                }
                            });
                        }
                    })
                });
            });
        } catch (error) {
            logger.error('Error borrando hsitoria:', error);
            reject(error);
        }
    });
};


var deleteContent = function deleteContent(id) {
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
                logger.notice('Se inicia la transacción de borrado de un contenido en base de datos FOCUS');

                const queryEvent = {
                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_CONTENT,
                    values: [id]
                };

                client.query('BEGIN', (err) => {
                    client.query(queryEvent, (err, resultEvent) => {
                        if (shouldAbort(err)) {
                            reject(err);
                        } else {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    reject(commitError);
                                } else {
                                    logger.notice('Borrado de la historia completada');
                                    resolve(true);
                                }
                            });
                        }
                    })
                });
            });
        } catch (error) {
            logger.error('Error borrando hsitoria:', error);
            reject(error);
        }
    });
};


/*--------------------------------------------*/

var correctNewHistory = function correctNewHistory(history) {
    if(!history.title){
        return false;
    }else{
        return true;
    }
}

var correctNewContents = function correctNewContents(history) {
    var isValid=true;
    if(history.contents){
        history.contents.forEach(function callback(individualContent, index, array) {
            if (!individualContent.title || !individualContent.description || !individualContent.id_graph) {
                allValid=false;
                console.log('dentro del forEAch' + allValid)
            }
        });
    }
    console.log('voy a devolver')
    return isValid;
}


module.exports = router;