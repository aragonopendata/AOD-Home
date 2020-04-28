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

//Load enums
const statesEnum =  constants.statesEnum;

/**
 * GET HISTORY BY ID ROUTE (PUBLIC)
 */
router.get(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, response, next) {
    
    var id = req.params.id;

    getHistoryById(id).then(fullHistory => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'DETALLE DE UNA HISTORIA POR ID- Historia obtenida correctamente',
            'history': fullHistory
        });
    }).catch(error => {
        logger.error('DETALLE DE UNA HISTORIA POR ID - Error al obtener la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'DETALLE DE UNA HISTORIA POR ID - Error al obtener la historia en base de datos' ,
        });
        return;
    });

});

/**
 * GET HISTORY BY TOKEN ROUTE (ONLY FOR THE USER WHO KNOW TOKEN)
 */
router.get(constants.API_URL_FOCUS_HISTORY_TOKEN + "/:token" , function (req, response, next) {
    
    var token = req.params.token;

    getHistoryByToken(token).then(fullHistory => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'DETALLE DE UNA HISTORIA POR TOKEN- Historia obtenida correctamente',
            'history': fullHistory
        });
    }).catch(error => {
        logger.error('DETALLE DE UNA HISTORIA POR TOKEN - Error al obtener la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'DETALLE DE UNA HISTORIA POR TOKEN - Error al obtener la historia en base de datos' ,
        });
        return;
    });

});

/**
 * GET HISTORY BY TOKEN ROUTE (ONLY FOR THE USER WHO KNOW TOKEN)
 */
router.get(constants.API_URL_FOCUS_STATE_HISTORY_TOKEN + "/:token" , function (req, response, next) {
    
    var token = req.params.token;

    getStateHistoryByToken(token).then(state => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'DETALLE DE UNA HISTORIA POR TOKEN- Historia obtenida correctamente',
            'state': state
        });
    }).catch(error => {
        logger.error('DETALLE DE UNA HISTORIA POR TOKEN - Error al obtener la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'DETALLE DE UNA HISTORIA POR TOKEN - Error al obtener la historia en base de datos' ,
        });
        return;
    });

});

/**
 * GET RESUMES OF PUBLICS HISTORIES BY STATE "PUBLICADA", BY SEARCH AND BY CATEGORIE (WITHOUT CONTENTS)
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, response, next) {

    getAllPublicsHistories(req.query.text, req.query.category).then(resumeHistories => {
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
    
    var history = req.body;

    console.log('entro con historia')

    if ( !history || !history.title ){
        logger.error('Input Error', 'Incorrect input');
        response.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    inserHistoryTransaction(history).then(historyInfo => {

        logger.info('CREACIÓN DE UNA HISTORIA - Historia creada correctamente')
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'CREACION DE UNA HISTORIA COMPLETA - Historia creada correctamente',
            'id': historyInfo.id,
            'token': historyInfo.token,
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

    console.log('voy a entrar ')
    
    var history = req.body;

    if ( !history || !history.title ){
        logger.error('Input Error', 'Incorrect input');
        res.json({ 'status': constants.REQUEST_ERROR_BAD_DATA, error: 'Incorrect Input' });
        return;
    }

    updateHistoryTransaction(history).then(historyInfo => {

        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'ACTUALIZACIÓN DE UNA HISTORIA - Historia actualizada correctamente',
            'id': historyInfo.id,
            'token': historyInfo.token
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



function getHistoryById(id){

    console.log('entro getHistoryById')

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('getHistoryInFocus - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                const queryHistory = {
                    text: dbQueries.DB_FOCUS_GET_HISTORY_BY_ID,
                    values: [id]
                }

                console.log(queryHistory)

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

function getHistoryByToken(token){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('getHistoryByToken - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                const queryHistory = {
                    text: dbQueries.DB_FOCUS_GET_HISTORY_BY_TOKEN,
                    values: [token]
                }

                console.log(queryHistory)

                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryHistory, (err, result) => {
                    if (err) {
                        done();
                        logger.error('getHistoryByToken - Error obteniendo la historia',err.stack);
                        reject(err);
                    } else {
                        //Si tiene un resultado, obtenemos la historia y la devolvemos
                        if( result.rows.length == 1 ){
                            logger.info('getHistoryByToken - Id historia recuperada: ' + result.rows[0].id);
                            var historySelect=result.rows[0];

                            const queryContent = {
                                text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES_PARTICULAR_HISTORY,
                                values: [historySelect.id]
                            }

                            console.log(queryContent)


                            //obtenemos los contenidos de la historia
                            pool.query(queryContent, (err, result) => {
                                done();
                                if (err) {
                                    logger.error('getHistoryByToken - Error obteniendo los contenidos de la historia:',err.stack);
                                    reject(err);
                                } else {
                                    logger.info('getHistoryByToken - Contenidos recuperados ');
                                    historySelect.contents = result.rows
                                    resolve(historySelect);
                                }
                            });
                        } else {
                            done();
                            logger.error('getHistoryByToken - No existe la historia');
                            resolve(null);
                        }
                    }
                });
            });
        } catch (error) {
            logger.error('getHistoryByToken -  Error buscando la historia por token:', error);
            reject(error);
        }
    });

}

function getAllPublicsHistories(text, category){


    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('getAllPublicsHistories - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                var queryHistories="";

                var search="%"+ text + "%";

                if(category==null){
                    queryHistories = {
                        text: dbQueries.DB_FOCUS_GET_HISTORIES_BY_STATE_AND_SEARCH,
                        values: [statesEnum.publicada, search],
                        rowMode: constants.SQL_RESULSET_FORMAT_JSON
                    }
                }else{
                    queryHistories = {
                        text: dbQueries.DB_FOCUS_GET_HISTORIES_BY_STATE_AND_SEARCH_AND_CATEGORY,
                        values: [statesEnum.publicada, search, category],
                        rowMode: constants.SQL_RESULSET_FORMAT_JSON
                    }
                }

                console.log(queryHistories)

                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryHistories, (err, result) => {
                    done();
                    if (err) {
                        logger.error('getAllPublicsHistories - Error obteniendo los detalles de historias:',err.stack);
                        reject(err);
                    } else {
                        logger.notice('getAllPublicsHistories - Obtención de detalles de historias finalizada')
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

function getStateHistoryByToken(token){


    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('getStateHistoryByToken - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                var queryStateHistory = {
                    text: dbQueries.DB_FOCUS_GET_STATE_HISTORY_BY_TOKEN,
                    values: [token],
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                }


                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryStateHistory, (err, result) => {
                    done();
                    if (err) {
                        logger.error('getStateHistoryByToken - Error obteniendo el estado de la historia:',err.stack);
                        reject(err);
                    } else {
                        logger.notice('getStateHistoryByToken - Obtención del estado de una historia')
                        //var resumeHistories=result.rows;
                        resolve(result.rows[0].state);
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

                if(err){
                    logger.error('inserHistoryTransaction - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                newToken().then( (token ) => {

                    console.log('token generado')

                    logger.notice('Se inicia la transacción de insercion de una historia');

                    client.query('BEGIN', (err) => {

                        if (rollback(client, done, err)) {
                            logger.error('inserHistoryTransaction - Error creando historia:', err);
                            reject(err);
                        } else {
                            console.log('vamos a insertar')
                            inserHistory(client, done, token, history, null).then( (idHistory) => {
                                client.query('COMMIT', (commitError) => {
                                    done();
                                    if (commitError) {
                                        logger.error('inserHistoryTransaction - Error creando historia:', commitError);
                                        reject(commitError);
                                    } else {
                                        logger.notice('inserHistoryTransaction - Creación de historia finalizada')
                                        var objectInfo=new Object;
                                        objectInfo.id=idHistory;
                                        objectInfo.token=token;
                                        resolve(objectInfo);
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
    console.log(history)

    console.log('entra')
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('updateHistoryTransaction - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }


                logger.notice('Se inicia la transacción de edicion de una historia');

                if(history.state==statesEnum.borrador || history.state==statesEnum.revision){//quitar rev, solo para admin!
                    if((history.id_reference==history.id)&&(history.state==statesEnum.revision)){//caso versionado de historia --> cambiar id antigua (actualizando con nueva), y guardado de la nueva 
                        getHistoryById(history.id).then(fullHistory => {
                            console.log(fullHistory)
                            console.log('entro aqui')
                            if(fullHistory.state==statesEnum.publicada){
                                client.query('BEGIN', (err) => {
                                    if (rollback(client, done, err)) {
                                        reject(err);
                                    } else {
                                        newToken().then( (token ) => {
                                            console.log('nuevo 1')
                                            var id = history.id;
                                            updateForVersion(client, done, id,token).then( () => {
                                                console.log('nuevo 2')

                                                history.id_reference=id;
                                                inserHistory(client, done, history.token, history,null).then( (idHistory) => {
                                                    console.log('nuevo 3')

                                                    client.query('COMMIT', (commitError) => {
                                                        done();
                                                        if (commitError) {
                                                            logger.error('updateHistoryTransaction - Error actualizando la historia con versionado:', commitError);
                                                            reject(commitError);
                                                        } else {
                                                            logger.notice('updateHistoryTransaction - modificación de historia con versionado finalizada')
                                                            var objectInfo=new Object;
                                                            objectInfo.id=idHistory;
                                                            objectInfo.token=history.token;
                                                            resolve(objectInfo);
                                                        }
                                                    });
                                                }).catch(error => {
                                                    logger.error('updateHistoryTransaction - Error actualizando la historia con versionado:', error);
                                                    reject(error);
                                                });
                                                
            
                                            }).catch(error => {
                                                logger.error('updateHistoryTransaction - Error actualizando la historia con versionado:', error);
                                                reject(error);
                                            });
            
                                        }).catch(error => {
                                            logger.error('updateHistoryTransaction - Error actualizando la historia con versionado:', error);
                                            reject(error);
                                        });
                                        
                                    }
                                });

                            }else{
                                logger.notice('updateHistoryTransaction - La historia no presenta el estado de publicada como se indica en el objeto recibido')
                                reject('updateHistoryTransaction - La historia no presenta el estado de publicada como se indica en el objeto recibido');        
                            }
                        }).catch(error => {
                            logger.error('updateHistoryTransaction - Error al comprobar la historia versionada:', error);
                            reject(error);
                        });
                    }else if(history.state==statesEnum.borrador){
                        client.query('BEGIN', (err) => {
    
                            if (rollback(client, done, err)) {
                                reject(err);
                            } else {
                                var token = history.token;
                                var id=history.id;
                                deleteHistory(client, done, id).then( () => {
                                    inserHistory(client, done, token, history, id).then( (idHistory) => {
                                        client.query('COMMIT', (commitError) => {
                                            done();
                                            if (commitError) {
                                                logger.error('updateHistoryTransaction - Error modificando la historia:', commitError);
                                                reject(commitError);
                                            } else {
                                                logger.notice('updateHistoryTransaction - modificación de historia finalizada')
                                                var objectInfo=new Object;
                                                objectInfo.id=idHistory;
                                                objectInfo.token=token;
                                                resolve(objectInfo);                                            }
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
    
                    }else{
                        logger.notice('updateHistoryTransaction - La historia no presenta una estructura de actualización correcta')
                        reject('updateHistoryTransaction - La historia no presenta una estructura de actualización correcta');
                    }
                }else{
                    logger.notice('updateHistoryTransaction - La historia no presenta un estado de actualización correcto')
                    reject('updateHistoryTransaction - La historia no presenta un estado de actualización correcto');
                }
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

                if(err){
                    logger.error('deleteHistoryTransaction - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

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

function inserHistory(client, done, token, history, id){
    //prestar atencion al mail

    console.log('aqui atencion al mail')


    return new Promise((resolve, reject) => {

        if(history.state==statesEnum.borrador || history.state==statesEnum.revision){
            try {
                var queryHistory="";
                if(id==null){
                    queryHistory = {
                        text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                        values: [token, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories, history.create_date, history.update_date]
                    };
                }else{
                    queryHistory = {
                        text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY_WITH_ID,
                        values: [token, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories, history.create_date, history.update_date, id]
                    };
                }
                console.log(queryHistory)
                client.query(queryHistory, (err, resultHistory) => {
                    if (rollback(client, done, err)) {
                        logger.error('inserHistory - Error guardando historia:', err);
                        reject(err);
                    } else {
                        id_history=resultHistory.rows[0].id;
                        console.log(id_history)
                        if(history.contents){
                            var sqlContents =  dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY;
                            var valuesContents= (history.contents).map(item => [item.title, item.description, item.type_content, item.visual_content, item.align, id_history])
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

        }else{
            logger.error('inserHistory - La hisotoria a guardar no presenta un estado para ser guardada ');
            reject('inserHistory - La hisotoria a guardar no presenta un estado para ser guardada' );
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
                text: dbQueries.DB_FOCUS_EXIST_HISTORY_BY_TOKEN,
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
    return result;probeTokenForId
}


function updateForVersion(client, done, idHistory, tokenNewForHistory){

    return new Promise((resolve, reject) => {

        try {

            const queryUpdateForVersion = {
                text: dbQueries.DB_FOCUS_UPDATE_FOCUS_HISTORY_ID_VERSION,
                values: [tokenNewForHistory,idHistory]
            };

            console.log(queryUpdateForVersion)

            //cambio token antiguo
            client.query(queryUpdateForVersion, (err, resultUpdateIdVersion) => {

                if (rollback(client, done, err)) {
                    logger.error('updateForVersion - Error cambiando id de la historia:', err);
                    reject(err);
                } else {
                    logger.info('updateForVersion - cambio id antigua por nuevo de '+ idHistory + ' al nuevo id '+ tokenNewForHistory)
                    resolve(true)
                }
            })

        } catch (error) {
            logger.error('updateForVersion -  Error cambiando id de la historia:', error);
            reject(error);
        }
    });

}

function probeTokenForId(token, id){

    return new Promise((resolve, reject) => {

        try {

            const queryProbeTokenForId = {
                text: dbQueries.DB_FOCUS_GET_HISTORY_BY_ID,
                values: [id]
            };

            client.query(queryProbeTokenForId, (err, resultUpdateIdVersion) => {

                if (rollback(client, done, err)) {
                    logger.error('probeTokenForId - Error probando la relación id-token:', err);
                    reject(err);
                } else {
                    if(resultUpdateIdVersion.token==token){
                        logger.info('probeTokenForId - Comprobación correcta de relación id-token')
                        resolve(true)
                    }else{
                        logger.info('probeTokenForId - Comprobación incorrecta de relación id-token')
                        resolve(false)
                    }
                }
            })

        } catch (error) {
            logger.error('probeTokenForId - Error probando la relación id-token:', error);
            reject(error);
        }
    });

}



module.exports = router;
