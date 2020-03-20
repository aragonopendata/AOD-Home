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
const format = require('pg-format');

//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);


/**
 * CREATE NEW HISTORY ROUTE
 */
router.put(constants.API_URL_FOCUS_HISTORY, function (req, res, next) {
    var history = req.body;

    
    createHistoryInFocus(history).then(historyId => {
        if (historyId) {
            logger.info('CREACIÓN DE UNA HISTORIA - Historia creada correctamente')
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'CREACION DE UNA HISTORIA COMPLETA- Historia creada correctamente',
                'id': historyId
            });
        } else {
            logger.error('CREACIÓN DE UNA HISTORIA - Error al crear la historia en base de datos ');
            res.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'CREACIÓN DE UNA HISTORIA- Error al crear la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('CREACIÓN DE UNA HISTORIA xxx- Error al crear la historia en base de datos : ', error);
        res.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'CREACIÓN DE UNA HISTORIA- Error al crear la historia en base de datos'+error ,
        });
        return;
    });

});

/**
 * GET HISTORY BY ID ROUTE
 */
router.get(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, res, next) {
    var id = req.params.id
    getHistoryInFocus(id).then(fullHistory => {
        if(fullHistory){
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Historia obtenida correctamente',
                'history': fullHistory
            });
        }else{
            res.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Error al obtener la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('OBTENCIÓN DE UNA HISTORIA COMPLETA - Error al obtener la historia en base de datos: ', error);
        res.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Error al obtener la historia en base de datos' ,
        });
        return;
    });
});

/**
 * GET A RESUME OF AN HISTORY (WITHOUT CONTENTS)
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, res, next) {

    getDetailHistoriesInCampus().then(resumeHistories => {
        if(resumeHistories){
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'OBTENCIÓN DE DETALLE DE HISTORIAS - Detalles de historias obtenida correctamente',
                'history': resumeHistories
            });
        }else{
            res.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos' ,
            });
            return
        }
    }).catch(error => {
        logger.error( 'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos:' , error);
        res.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error':  'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos'  ,
        });
        return
    });

});


/**
 * UPDATE HISTORY
 */
router.post(constants.API_URL_FOCUS_HISTORY , function (req, res, next) {
    var history = req.body;
    updateHistoryInFocus(history).then(idHistory => {
        if(idHistory){
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'ACTUALIZACIÓN DE UNA HISTORIA- Historia actualizada correctamente',
                'historyUpdate': idHistory
            });
        }else{
            res.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos: ', error);
        res.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos' ,
        });
        return;
    });
});

/**
 * DELETE HISTORY BY ID ROUTE
 */
router.delete(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, res, next) {
    var id = req.params.id
    deleteHistoryInFocus(id).then(idHistory => {
        if(idHistory){
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'BORRADO DE UNA HISTORIA- Historia borrada correctamente',
                'history': idHistory
            });
        }else{
            res.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos: ', error);
        res.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos' ,
        });
        return;
    });
});





/**
 * Función creación de una nueva historia (con contenidos o sin ellos) 
 * @param {*} history 
 * @param {*} id 
 */
var createHistoryInFocus = function createHistoryInFocus(history) {
    return new Promise((resolve, reject) => {
        if (!correctNewHistory(history)) {
            logger.error('Input Error', ' title of the history or some part of content don found not found');
            reject("Input Error', ' title of the history or some part of content don found not found");
            return;
        }
        try {
            generateToken().then(id => {
                pool.connect((err, client, done) => {
                    if (err) {
                        logger.error('Error de conexión creando la historia:',err.stack);
                        reject(err);
                        return;
                    }
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
    
                    logger.notice('Se inicia la transacción de creación de una nueva historia en base de datos FOCUS');
    
                    client.query('BEGIN', (err) => {
                        if (shouldAbort(err)) {
                            reject(err);
                            return;
                        } else {
                            const queryHistory = {
                                text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                                values: [id, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories]
                            };
                            client.query(queryHistory, (err, resultEvent) => {
                                if (shouldAbort(err)) {
                                    logger.error('Error creando historia:', err);
                                    reject(err);
                                    return;
                                } else {
                                    var idHistory=resultEvent.rows[0].id;
                                    logger.notice("Se ha creado la historia en la base de datos 'histories' se procede a la creación de su contenido");
                                    if(history.contents){
                                        var sqlContents =  dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY;
                                        var valuesContents= (history.contents).map(item => [item.title, item.description, item.id_graph, idHistory])
                                        client.query(format(sqlContents, valuesContents), (err, resultSites) => {
                                            if (shouldAbort(err)) {
                                                logger.error('Error creando historia:', err);
                                                reject(err);
                                                return;
                                            } else {
                                                logger.notice("Se han creado lso contenidos en la base de datos 'contents_histories'");
                                                client.query('COMMIT', (commitError) => {
                                                    done();
                                                    if (commitError) {
                                                        logger.error('Error creando historia:', commitError);
                                                        reject(commitError);
                                                        return;
                                                    } else {
                                                        logger.notice('Creación de historia finalizada (con contenidos contenidos)')
                                                        resolve(idHistory);
                                                    }
                                                });
                                            }
                                        });
                                    }else{
                                        client.query('COMMIT', (commitError) => {
                                            done();
                                            if (commitError) {
                                                logger.error('Error creando historia:', commitError);
                                                reject(commitError);
                                                return;
                                            } else {
                                                logger.notice('Creación de historia finalizada (sin contenidos)')
                                                resolve(idHistory);
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    });
                });
            }).catch(error => {
                reject(error);
                return;
            });
            
        } catch (error) {
            logger.error('Error creando historia:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Función de obtención de una  historia por medio de su id
 * @param {*} id 
 */
var getHistoryInFocus = function getHistoryInFocus(id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('Error de conexión obteniendo la historia:',err.stack);
                    reject(err)
                    return;
                }

                const queryHistory = {
                    text: dbQueries.DB_FOCUS_GET_HISTORY,
                    values: [id]
                }

                pool.query(queryHistory, (err, result) => {
                    if (err) {
                        logger.error('Error obteniendo la historia',err.stack);
                        reject(err)
                        return;
                    } else {
                        if(result.rows.length==1){
                            logger.info('Id historia recuperada: ' + result.rows[0].id);
                            var historySelect=result.rows[0]
                            const queryContent = {
                                text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES_PARTICULAR_HISTORY,
                                values: [historySelect.id]
                            }
                            pool.query(queryContent, (err, result) => {
                                if (err) {
                                    logger.error('Error obteniendo los contenidos de la historia:',err.stack);
                                    reject(err)
                                    return;
                                } else {
                                    var contents=result.rows
                                    historySelect.contents=contents
                                    logger.notice('Obtención de historia finalizada')
                                    resolve(historySelect);
                                }
                            });
                        }else{
                            logger.error('Error obteniendo la historia, id no encontrado');
                            reject("Id de historia no encontrado")
                            return;
                        }
                    }
                });
            });
                
        } catch (error) {
            logger.error('Error obteniendo la historia', error);
            reject(error);
            return;
        }
    });
};

/**
 * Función que obtiene los detalles de las historias (historias sin contenido)
 */
var getDetailHistoriesInCampus = function getDetailHistoriesInCampus() {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error("Error en la conexión obteniendo los detalles de las historias:", err.stack);
                    reject(err)
                    return;
                }

                const queryHistories = {
                    text: dbQueries.DB_FOCUS_GET_HISTORIES,
                    rowMode: constants.SQL_RESULSET_FORMAT
                }

                pool.query(queryHistories, (err, result) => {
                    if (err) {
                        logger.error('Error obteniendo los detalles de historias:',err.stack);
                        reject(err)
                        return;
                    } else {
                        logger.notice('Obtención de detalles de historias finalizada')
                        var resumeHistories=result.rows
                        resolve(resumeHistories)
                    }
                });
            });
                
        } catch (error) {
            logger.error('Error obteniendo el detalle de historias:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Función de borrado de una  historia por medio de su id
 * @param {*} id 
 */
var deleteHistoryInFocus = function deleteHistoryInFocus(id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('Error de conexión para borrar historia:',err.stack);
                    reject(err);
                    return;
                }
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

                const queryDeleteContents = {
                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_CONTENT_BY_ID_HISTORY,
                    values: [id]
                };
                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                        return;
                    } else {
                        client.query(queryDeleteContents, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                logger.error('Error borrando los contenidos de la historia:', err);
                                reject(err);
                                return;
                            } else {
                                logger.notice("Se han borrado los posibles contenidos asociados a una historia, se procede a borrar la historia en la base de datos 'histories' se procede a la creación de su contenido");
                                const queryDeleteHistory = {
                                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_HISTORY,
                                    values: [id]
                                };
                                client.query(queryDeleteHistory, (err, resultEvent) => {
                                    if (shouldAbort(err)) {
                                        logger.error('Error borrando la historia:', err);
                                        reject(err);
                                        return;
                                    } else {
                                        logger.notice("Se ha borrado la historia");
                                        client.query('COMMIT', (commitError) => {
                                            done();
                                            if (commitError) {
                                                logger.error('Error borrando historia:', commitError);
                                                reject(commitError);
                                                return;
                                            } else {
                                                logger.notice('Creación de historia finalizada (con contenidos contenidos)')
                                                resolve(id);
                                            }
                                        });
                                    }
                                });

                            }
                        })
                    }
                });
            });
        } catch (error) {
            logger.error('Error creando historia:', error);
            reject(error);
            return;
        }
    });
    
};


/**
 * Función de actualización de una  historia
 * @param {*} id 
 */
var updateHistoryInFocus = function updateHistoryInFocus(history) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('Error de conexión al actualizar la historia:',err.stack);
                    reject(err);
                    return;
                }
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

                logger.notice('Se inicia la transacción de actualización de una historia en base de datos FOCUS');

                //Por análisis se borrará la existente y se introducirá la misma, conservando el id de historia en ambos registros
                const queryDeleteContents = {
                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_CONTENT_BY_ID_HISTORY,
                    values: [history.id]
                };
                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                        return;
                    } else {
                        client.query(queryDeleteContents, (err, resultEvent) => {
                            if (shouldAbort(err)) {
                                logger.error('Error borrando los contenidos de la historia al actualizar la historia:', err);
                                reject(err);
                                return;
                            } else {
                                logger.notice("Se han borrado los posibles contenidos asociados a una historia, se procede a borrar la historia en la base de datos 'histories' se procede a la creación de su contenido");
                                const queryDeleteHistory = {
                                    text: dbQueries.DB_ADMIN_DELETE_FOCUS_HISTORY,
                                    values: [history.id]
                                };
                                client.query(queryDeleteHistory, (err, resultEvent) => {
                                    if (shouldAbort(err)) {
                                        logger.error('Error borrando la historia en el proceso de actualización:', err);
                                        reject(err);
                                        return;
                                    } else {
                                        logger.notice("Se ha borrado la historia en el proceso de actualización:");
                                        //Se vuelve a insertar con los datos actualizados
                                        const queryHistory = {
                                            text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                                            values: [history.id, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories]
                                        };
                                        client.query(queryHistory, (err, resultEvent) => {
                                            if (shouldAbort(err)) {
                                                logger.error('Error creando historia en el proceso de actualización::', err);
                                                reject(err);
                                                return;
                                            } else {
                                                var idHistory2=resultEvent.rows[0].id;
                                                logger.notice("Se ha creado la historia en la base de datos 'histories' se procede a la creación de su contenido");
                                                if(history.contents){
                                                    var sqlContents =  dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY;
                                                    var valuesContents= (history.contents).map(item => [item.title, item.description, item.id_graph, idHistory2])
                                                    client.query(format(sqlContents, valuesContents), (err, resultSites) => {
                                                        if (shouldAbort(err)) {
                                                            logger.error('Error creando historia en el proceso de actualización::', err);
                                                            reject(err);
                                                            return;
                                                        } else {
                                                            logger.notice("Se han creado lso contenidos en la base de datos 'contents_histories' en el proceso de actualización:");
                                                            client.query('COMMIT', (commitError) => {
                                                                done();
                                                                if (commitError) {
                                                                    logger.error('Error creando historia en el proceso de actualización::', commitError);
                                                                    reject(commitError);
                                                                    return;
                                                                } else {
                                                                    logger.notice('Creación de historia finalizada (con contenidos contenidos) en el proceso de actualización:')
                                                                    resolve(idHistory2);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }else{
                                                    client.query('COMMIT', (commitError) => {
                                                        done();
                                                        if (commitError) {
                                                            logger.error('Error creando historia en el proceso de actualización::', commitError);
                                                            reject(commitError);
                                                            return;
                                                        } else {
                                                            logger.notice('Creación de historia finalizada (sin contenidos) en el proceso de actualización:')
                                                            resolve(idHistory);
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                });

                            }
                        })
                    }
                });
            });
        } catch (error) {
            logger.error('Error actualizando historia:', error);
            reject(error);
            return;
        }
    });
    
};


var correctNewHistory = function correctNewHistory(history) {
    if(!history.title){
        return false;
    }else{
        return true;
    }
}



function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var generateToken = function generateToken() {
    return new Promise((resolve, reject) => {
        try {
            var id= makeToken(10);
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('Error de conexión generando el token:',err.stack);
                    reject(err);
                    return;
                }

                logger.notice('Se inicia la transacción de determinar si una historia existe en la base de datos FOCUS');

                const queryDb = {
                    text: dbQueries.DB_FOCUS_EXIST_HISTORY,
                    values: [id]
                };
                pool.query(queryDb, function (err, result) {
                    if (err) {
                        logger.error('Error : ', err);
                        resolve('GENERACIÓN TOKEN HISTORIA - Error generando el token');
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
            logger.error('Error generando token :', error);
            reject(error);
            return 
        }
    });
}


module.exports = router;