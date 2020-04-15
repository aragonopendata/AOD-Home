//region Libraries
const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');

//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);


/**
 * GET A RESUME OF AN HISTORY (WITHOUT CONTENTS)
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, response, next) {

    getAllHistories(req.query.sort, req.query.limit, req.query.page, req.query.text).then(histories => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'LISTADO DE HISTORIAS - Detalles de historias obtenida correctamente',
            'histories': histories
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
 * DELETE HISTORY
 */
/*router.delete(constants.API_URL_FOCUS_HISTORY + "/:id", function (req, response, next) {
    
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
});*/


/**
 * DELETE HISTORY (CHANGE STATE TO HIDDEN)
 */
router.delete(constants.API_URL_FOCUS_HISTORY + "/:id", function (req, response, next) {
    var id = req.params.id

    deleteHistoryTransaction(id).then( () => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'BORRADO DEL ESTADO DE LA HISTORIA - Historia borrada correctamente',
            'history': id
        });
    }).catch(error => {
        logger.error('BORRADO DEL ESTADO DE LA HISTORIA - Error al borrar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'BORRADO DEL ESTADO DE LA HISTORIA - Error al borrar la historia en base de datos' ,
        });
        return;
    });
});

/**
 * PUBLISH HISTORY (CHANGE STATE TO HIDDEN)
 */
router.post(constants.API_URL_FOCUS_HISTORY, function (req, response, next) {
    var id = req.body.id;

    publishHistoryTransaction(id).then( () => {
        response.json({
            'status': constants.REQUEST_REQUEST_OK,
            'success': true,
            'result': 'PUBLICADO DE LA HISTORIA - Historia publicada correctamente',
            'history': id
        });
    }).catch(error => {
        logger.error('PUBLICADO DE LA HISTORIA - Error al publicar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'PUBLICADO DE LA HISTORIA - Error al publicar la historia en base de datos' ,
        });
        return;
    });
});



function getAllHistories( order, limit, page, text){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('getAllHistories - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                var offset = limit*page;
                var search="%"+ text + "%";

                const queryHistories = {
                    text: dbQueries.DB_FOCUS_GET_HISTORIES_PAGINATE + ' ORDER BY '+ order + ' LIMIT '+limit+ ' OFFSET '+offset ,
                    values: [search],
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                }

                //Se busca la historia introducida como parámetro en la tabla histories
                pool.query(queryHistories, (err, result) => {
                    if (err) {
                        logger.error('getAllHistories - Error obteniendo los detalles de historias:',err.stack);
                        reject(err);
                    } else {
                        var histories = {
                            list: result.rows,
                        };

                        const queryHistoriesCount = {
                            text: dbQueries.DB_FOCUS_GET_HISTORIES_COUNT,
                            values: [search],
                            rowMode: constants.SQL_RESULSET_FORMAT_JSON
                        }

                        pool.query(queryHistoriesCount, (err2, result2) => {
                            done();
                            if (err2) {
                                logger.error('getAllHistories - Error obteniendo el numero historias:',err2.stack);
                                reject(err2);
                            } else {
                                logger.notice('getAllHistories - Obtención de numero de historias finalizada')
                                histories.numHistories = result2.rows[0].count;
                                resolve(histories);
                            }
                        });
        
                    }
                });

            });
        } catch (error) {
            logger.error('getDetailHistoriesInCampus - Error obteniendo el detalle de historias:', error);
            reject(error);
        }
    });

}


/*function deleteHistoryTransaction(id){

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

}*/



function deleteHistoryTransaction(id){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('deleteHistoryTransaction - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                logger.notice('Se inicia la transacción de eliminación de una historia');

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
                                    logger.notice('deleteHistoryTransaction - eliminación de la historia finalizada');
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


function deleteHistory(client, done, idHistory){

    return new Promise((resolve, reject) => {

        try {

            console.log('deleteHistory');
            const queryDeleteHistory = {
                text: dbQueries.DB_FOCUS_UPDATE_FOCUS_STATE_HISTORY,
                values: [4, idHistory]
            };

            //Eliminar historia
            client.query(queryDeleteHistory, (err, resultDeleteHistory) => {
                if (rollback(client, done, err)) {
                    logger.error('deleteHistory - Error eliminando la historia:', err);
                    reject(err);
                } else {
                    logger.notice('deleteHistory - eliminación de la historia finalizada');
                    resolve(true);
                }
            });

        } catch (error) {
            logger.error('deleteHistory - Error eliminando la historia:', error);
            reject(error);
        }
    });

}



function publishHistoryTransaction(id){

    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {

                if(err){
                    logger.error('publishHistoryTransaction - No se puede establecer conexión con la BBDD');
                    reject(err)
                    return
                }

                logger.notice('Se inicia la transacción de publicaciòn de una historia');

                client.query('BEGIN', (err) => {

                    if (rollback(client, done, err)) {
                        reject(err);
                    } else {
                        publishHistory(client, done, id).then( () => {
                            client.query('COMMIT', (commitError) => {
                                done();
                                if (commitError) {
                                    logger.error('publishHistoryTransaction - Error publicando la historia:', error);
                                    reject(commitError);
                                } else {
                                    logger.notice('publishHistoryTransaction - publicaciòn de la historia finalizada');
                                    resolve(true);
                                }
                            });
                        }).catch(error => {
                            logger.error('publishHistoryTransaction - Error publicando la historia:', error);
                            reject(error);
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('publishHistoryTransaction - Error publicando la historia:', error);
            reject(error);
        }
    });

}


function publishHistory(client, done, idHistory){

    return new Promise((resolve, reject) => {

        try {
            const queryPublishHistory = {
                text: dbQueries.DB_FOCUS_UPDATE_FOCUS_STATE_HISTORY,
                values: [3, idHistory]
            };

            //Eliminar historia
            client.query(queryPublishHistory, (err, resultPublishHistory) => {
                if (rollback(client, done, err)) {
                    logger.error('publishHistory - Error publicando la historia:', err);
                    reject(err);
                } else {
                    logger.notice('publishHistory - publicacion de la historia finalizada');
                    resolve(true);
                }
            });

        } catch (error) {
            logger.error('publishHistory - Error publicando la historia:', error);
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


module.exports = router;
