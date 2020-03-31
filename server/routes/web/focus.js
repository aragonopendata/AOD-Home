//region Libraries
const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');

// FormData for send form-data
const format = require('pg-format');

//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/**
 * GET HISTORY BY ID ROUTE
 */
router.get(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, response, next) {
    
    var id = req.params.id;

    getHistoryById(id).then(fullHistory => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'DETALLE DE UNA HISTORIA - Historia obtenida correctamente',
            'history': fullHistory
        });
    }).catch(error => {
        logger.error('DETALLE DE UNA HISTORIA - Error al obtener la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'DETALLE DE UNA HISTORIA - Error al obtener la historia en base de datos' ,
        });
        return;
    });

});

/**
 * GET A RESUME OF AN HISTORY (WITHOUT CONTENTS)
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, response, next) {

    getAllHistories().then(resumeHistories => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'LISTADO DE HISTORIAS - Detalles de historias obtenida correctamente',
            'history': resumeHistories
        });
    }).catch(error => {
        logger.error( 'LISTADO DE HISTORIAS - Error al obtener las historias de la base de datos:' , error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error':  'LISTADO DE HISTORIAS - Error al obtener las historias de la base de datos'  ,
        });
        return;
    });

});

/**
 * CREATE NEW HISTORY
 */
router.put(constants.API_URL_FOCUS_HISTORY, function (req, response, next) {

    console.log('entro')

    console.log(req.body)
    
    var history = req.body;

    if ( !history || !history.title ){
        logger.error('Input Error', 'Incorrect input');
        response.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    inserHistoryTransaction(history).then(historyId => {

        logger.info('CREACIÓN DE UNA HISTORIA - Historia creada correctamente')
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'CREACION DE UNA HISTORIA COMPLETA - Historia creada correctamente',
            'id': historyId
        });
        
    }).catch(error => {
        logger.error('CREACIÓN DE UNA HISTORIA - Error al crear la historia en base de datos : ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'CREACIÓN DE UNA HISTORIA - Error al crear la historia en base de datos' ,
        });
        return;
    });
});

/**
 * UPDATE HISTORY
 */
router.post(constants.API_URL_FOCUS_HISTORY, function (req, response, next) {
    
    var history = req.body;

    if ( !history || !history.title ){
        logger.error('Input Error', 'Incorrect input');
        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    updateHistoryTransaction(history).then(idHistory => {

        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'ACTUALIZACIÓN DE UNA HISTORIA - Historia actualizada correctamente',
            'historyUpdate': idHistory
        });
        
    }).catch(error => {
        logger.error('ACTUALIZACIÓN DE UNA HISTORIA - Error al actualizar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'ACTUALIZACIÓN DE UNA HISTORIA - Error al actualizar la historia en base de datos' ,
        });
        return;
    });
});

/**
 * DELETE HISTORY
 */
router.delete(constants.API_URL_FOCUS_HISTORY + "/:id", function (req, response, next) {
    
    var id = req.params.id

    deleteHistoryTransaction(id).then( () => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'BORRADO DE UNA HISTORIA - Historia borrada correctamente',
            'history': id
        });
    }).catch(error => {
        logger.error('BORRADO DE UNA HISTORIA - Error al borrar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'BORRADO DE UNA HISTORIA - Error al borrar la historia en base de datos' ,
        });
        return;
    });
});


function getHistoryById(id){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                const queryHistory = {
                    text: dbQueries.DB_FOCUS_GET_HISTORY,
                    values: [id]
                }

                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryHistory, (err, result) => {
                    if (err) {
                        done();
                        logger.error('getHistoryInFocus - Error obteniendo la historia',err.stack);
                        reject(err);
                    } else {
                        //Si tiene un resultado, obtenemos la historia y la devolvemos
                        if( result.rows.length == 1 ){
                            logger.info('getHistoryInFocus - Id historia recuperada: ' + result.rows[0].id);
                            var historySelect=result.rows[0];

                            const queryContent = {
                                text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES_PARTICULAR_HISTORY,
                                values: [historySelect.id]
                            }

                            //obtenemos los contenidos de la historia
                            pool.query(queryContent, (err, result) => {
                                done();
                                if (err) {
                                    logger.error('getHistoryInFocus - Error obteniendo los contenidos de la historia:',err.stack);
                                    reject(err);
                                } else {
                                    logger.info('getHistoryInFocus - Contenidos recuperados ');
                                    historySelect.contents = result.rows
                                    resolve(historySelect);
                                }
                            });
                        } else {
                            done();
                            logger.error('getHistoryInFocus - No existe la historia');
                            resolve(null);
                        }
                    }
                });
            });
        } catch (error) {
            logger.error('Error creando la nueva historia:', error);
            reject(error);
        }
    });

}

function getAllHistories(){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                const queryHistories = {
                    text: dbQueries.DB_FOCUS_GET_HISTORIES,
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                }

                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryHistories, (err, result) => {
                    done();
                    if (err) {
                        logger.error('getAllHistories - Error obteniendo los detalles de historias:',err.stack);
                        reject(err);
                    } else {
                        logger.notice('getAllHistories - Obtención de detalles de historias finalizada')
                        var resumeHistories=result.rows;
                        resolve(resumeHistories);
                    }
                });

            });
        } catch (error) {
            logger.error('getDetailHistoriesInCampus - Error obteniendo el detalle de historias:', error);
            reject(error);
        }
    });

}

function inserHistoryTransaction(history){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                newToken().then( (token ) => {

                    logger.notice('Se inicia la transacción de insercion de una historia');

                    client.query('BEGIN', (err) => {

                        if (rollback(client, done, err)) {
                            logger.error('inserHistoryTransaction - Error creando historia:', err);
                            reject(err);
                        } else {
                            inserHistory(client, done, token, history).then( (idHistory) => {
                                client.query('COMMIT', (commitError) => {
                                    done();
                                    if (commitError) {
                                        logger.error('inserHistoryTransaction - Error creando historia:', commitError);
                                        reject(commitError);
                                    } else {
                                        logger.notice('inserHistoryTransaction - Creación de historia finalizada')
                                        resolve(idHistory);
                                    }
                                });
                            }).catch(error => {
                                logger.error('inserHistoryTransaction - Error insertando la historia:', error);
                                reject(error);
                            });
                        }
                    });
                }).catch(error => {
                    logger.error('inserHistoryTransaction - Error generando el token de la historia:', error);
                    reject(error);
                });

            });
        } catch (error) {
            logger.error('inserHistoryTransaction - Error creando la nueva historia:', error);
            reject(error);
        }
    });

}

function updateHistoryTransaction(history){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                logger.notice('Se inicia la transacción de edicion de una historia');

                client.query('BEGIN', (err) => {

                    if (rollback(client, done, err)) {
                        reject(err);
                    } else {
                        var id = history.id;
                        history.id = null;
    
                        deleteHistory(client, done, id).then( () => {
                            inserHistory(client, done, id, history).then( (idHistory) => {
                                client.query('COMMIT', (commitError) => {
                                    done();
                                    if (commitError) {
                                        logger.error('updateHistoryTransaction - Error modificando la historia:', commitError);
                                        reject(commitError);
                                    } else {
                                        logger.notice('updateHistoryTransaction - modificación de historia finalizada')
                                        resolve(idHistory);
                                    }
                                });
                            }).catch(error => {
                                logger.error('updateHistoryTransaction - Error insertando la historia:', error);
                                reject(error);
                            });
                        }).catch(error => {
                            logger.error('updateHistoryTransaction - Error eliminando la historia:', error);
                            reject(error);
                        });
                    }
                });
                
            });
        } catch (error) {
            logger.error('updateHistoryTransaction - Error modificando la historia:', error);
            reject(error);
        }
    });

}

function deleteHistoryTransaction(id){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                logger.notice('Se inicia la transacción de eliminacion de una historia');

                client.query('BEGIN', (err) => {

                    if (rollback(client, done, err)) {
                        reject(err);
                    } else {
                        deleteHistory(client, done, id).then( () => {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    logger.error('deleteHistoryTransaction - Error eliminando la historia:', error);
                                    reject(commitError);
                                } else {
                                    logger.notice('deleteHistoryTransaction - eliminación de historia finalizada');
                                    resolve(true);
                                }
                            });
                        }).catch(error => {
                            logger.error('deleteHistoryTransaction - Error eliminando la historia:', error);
                            reject(error);
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('deleteHistoryTransaction - Error eliminando la historia:', error);
            reject(error);
        }
    });

}

function inserHistory(client, done, token, history){

    if(!history.create_date){
        history.create_date= new Date().toISOString()
    }else{
        history.update_date=new Date().toISOString()
    }

    return new Promise((resolve, reject) => {

        try {

            const queryHistory = {
                text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                values: [token, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories, history.create_date, history.update_date]
            };
            client.query(queryHistory, (err, resultHistory) => {
                if (rollback(client, done, err)) {
                    logger.error('inserHistory - Error guardando historia:', err);
                    reject(err);
                } else {
                    if(history.contents){
                        var sqlContents =  dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY;
                        var valuesContents= (history.contents).map(item => [item.title, item.description, item.type_content, item.visual_content, item.align, token])
                        console.log(sqlContents)
                        console.log(valuesContents)
                        client.query(format(sqlContents, valuesContents), (err, resultContents) => {
                            if (rollback(client, done, err)) {
                                logger.error('inserHistory - Error insertando la historia:', err);
                                reject(err);
                                console.log('error')
                            } else {
                                logger.notice('inserHistory - inserción de la historia finalizada');
                                resolve(resultHistory.rows[0].id);
                            }
                        });
                    } else {
                        logger.error('inserHistory - Error insertando la historia:', err);
                        resolve(resultHistory.rows[0].id);
                    }
                }
            })

        } catch (error) {
            logger.error('Error insertando historia:', error);
            reject(error);
        }
    });

}

function deleteHistory(client, done, idHistory){

    return new Promise((resolve, reject) => {

        try {

            const queryDeleteContents = {
                text: dbQueries.DB_ADMIN_DELETE_FOCUS_CONTENT_BY_ID_HISTORY,
                values: [idHistory]
            };

            //borrar contenidos
            client.query(queryDeleteContents, (err, resultDeleteContents) => {

                if (rollback(client, done, err)) {
                    logger.error('deleteHistory - Error eliminado historia:', err);
                    reject(err);
                } else {

                    const queryDeleteHistory = {
                        text: dbQueries.DB_ADMIN_DELETE_FOCUS_HISTORY,
                        values: [idHistory]
                    };

                    //borra historia
                    client.query(queryDeleteHistory, (err, resultDeleteHistory) => {
                        if (rollback(client, done, err)) {
                            logger.error('deleteHistory - Error eliminado historia:', err);
                            reject(err);
                        } else {
                            logger.notice('deleteHistory - eliminacion de la historia finalizada');
                            resolve(true);
                        }
                    });
                }
            })

        } catch (error) {
            logger.error('deleteHistory - Error eliminando historia:', error);
            reject(error);
        }
    });

}

function newToken() {
    return new Promise((resolve, reject) => {
        try {
            var token = makeToken(10);

            const queryDb = {
                text: dbQueries.DB_FOCUS_EXIST_HISTORY,
                values: [token]
            };

            pool.query(queryDb, function (err, result) {
                if (err) {
                    logger.error('newToken - Error : ', err);
                    reject(err);
                }else{
                    if(result.rowCount!=0){
                        resolve(newToken());
                    }else{
                        logger.notice('newToken - generacion del token correcta');
                        resolve(token);
                    }
                }
            });

        } catch (error) {
            logger.error('newToken - Error generando token :', error);
            reject(error);
        }
    });

}

function rollback(client, done, err){
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

/**
 * Función que crea el token
 * @param {*} length 
 */
function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
