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
 * CREATE NEW HISTORY
 */
router.put(constants.API_URL_FOCUS_HISTORY, function (req, response, next) {
    var history = req.body;

    createPrincipalHistoryInFocus(history).then(historyId => {
        if (historyId) {
            logger.info('CREACIÓN DE UNA HISTORIA - Historia creada correctamente')
            response.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'CREACION DE UNA HISTORIA COMPLETA- Historia creada correctamente',
                'id': historyId
            });
        } else {
            logger.error('CREACIÓN DE UNA HISTORIA - Error al crear la historia en base de datos ');
            response.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'CREACIÓN DE UNA HISTORIA- Error al crear la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('CREACIÓN DE UNA HISTORIA xxx- Error al crear la historia en base de datos : ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'CREACIÓN DE UNA HISTORIA- Error al crear la historia en base de datos' ,
        });
        return;
    });
});

/**
 * GET HISTORY BY ID ROUTE
 */
router.get(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, response, next) {
    var id = req.params.id
    getCompleteHistoryInFocus(id).then(fullHistory => {
        if(fullHistory){
            response.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Historia obtenida correctamente',
                'history': fullHistory
            });
        }else{
            response.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Error al obtener la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('OBTENCIÓN DE UNA HISTORIA COMPLETA - Error al obtener la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'OBTENCIÓN DE UNA HISTORIA COMPLETA- Error al obtener la historia en base de datos' ,
        });
        return;
    });
});

/**
 * GET A RESUME OF AN HISTORY (WITHOUT CONTENTS)
 */
router.get(constants.API_URL_FOCUS_HISTORIES, function (req, response, next) {

    getDetailHistoriesInCampus().then(resumeHistories => {
        if(resumeHistories){
            response.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'OBTENCIÓN DE DETALLE DE HISTORIAS - Detalles de historias obtenida correctamente',
                'history': resumeHistories
            });
        }else{
            response.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos' ,
            });
            return
        }
    }).catch(error => {
        logger.error( 'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos:' , error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error':  'OBTENCIÓN DE DETALLE DE HISTORIAS - Error al obtener los detalles de historias de la base de datos'  ,
        });
        return
    });

});

/**
 * UPDATE HISTORY
 */
router.post(constants.API_URL_FOCUS_HISTORY , function (req, response, next) {
    var history = req.body;
    updatePrincipalHistoryInFocus(history).then(idHistory => {
        if(idHistory){
            response.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'ACTUALIZACIÓN DE UNA HISTORIA- Historia actualizada correctamente',
                'historyUpdate': idHistory
            });
        }else{
            response.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'ACTUALIZACIÓN DE UNA HISTORIA- Error al actualizar la historia en base de datos' ,
        });
        return;
    });
});

/**
 * DELETE HISTORY BY ID ROUTE
 */
router.delete(constants.API_URL_FOCUS_HISTORY + "/:id" , function (req, response, next) {
    var id = req.params.id
    deletePrincipalHistoryInFocus(id).then(idHistory => {
        if(idHistory){
            response.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'BORRADO DE UNA HISTORIA- Historia borrada correctamente',
                'history': idHistory
            });
        }else{
            response.json({ 
                'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
                'error': 'BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos' ,
            });
            return;
        }
    }).catch(error => {
        logger.error('BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos: ', error);
        response.json({ 
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 
            'error': 'BORRADO DE UNA HISTORIA- Error al borrar la historia en base de datos' ,
        });
        return;
    });
});

/**
 * Main function for create a new history
 * @param {*} history 
 */
var createPrincipalHistoryInFocus = function createPrincipalHistoryInFocus(history){
    return new Promise((resolve, reject) => {
        //comprobamos que cumple las condiciones para guardar una historia
        if (!correctNewHistory(history)) {
            logger.error('createPrincipalHistoryInFocus - Input Error', ' title of the history or some part of content don found not found');
            reject("createPrincipalHistoryInFocus - Input Error', ' title of the history or some part of content don found not found");
            return;
        }
        try {
            //generamos un token (id) para la historia que no se encuentre en la BBDD
            generateToken().then(id => {
                //creamos el cliente que usaremos para hacer las peticiones
                pool.connect((err, client, done) => {
                    if (err) {
                        logger.error('createPrincipalHistoryInFocus - Error de conexión creando la historia:',err.stack);
                        reject(err);
                        return;
                    }
                    const shouldAbort = (err) => {
                        if (err) {
                            client.query('ROLLBACK', (err) => {
                                if (err) {
                                    console.error('createPrincipalHistoryInFocus - Error rolling back client', err.stack)
                                }
                                done();
                            })
                        }
                        return !!err;
                    }
                    logger.notice('createPrincipalHistoryInFocus - Se inicia la transacción de creación de una nueva historia en base de datos FOCUS');
                    client.query('BEGIN', (err) => {
                        if (shouldAbort(err)) {
                            reject(err);
                            return;
                        } else {
                            insertCompleteHistoryInFocus(history, id, client, done).then(idHistorySave => {
                                client.query('COMMIT', (commitError) => {
                                    done();
                                    if (commitError) {
                                        logger.error('createPrincipalHistoryInFocus - Error creando historia:', commitError);
                                        reject(commitError);
                                        return;
                                    } else {
                                        logger.notice('createPrincipalHistoryInFocus - Creación de historia finalizada')
                                        resolve(idHistorySave);
                                    }
                                });
                            }).catch(error => {
                                logger.error('createPrincipalHistoryInFocus - Error guardando la historia:', error);
                                reject(error);
                                return;
                            });
                        }
                    });
                });
            }).catch(error => {
                logger.error('createPrincipalHistoryInFocus - Error generando el token para la historia:', error);
                reject(error);
                return;
            });
        } catch (error) {
            logger.error('createPrincipalHistoryInFocus - Error creando historia:', error);
            reject(error);
            return;
        }
    });
}

/**
 * Function that insert an history (with/witout contents) in the BBDD
 * @param {*} history 
 * @param {*} id 
 * @param {*} client 
 * @param {*} done 
 */
var insertCompleteHistoryInFocus = function insertCompleteHistoryInFocus(history, id, client, done){
    return new Promise((resolve, reject) => {
        try {
            //Guardamos  la historia en la BBDD
            insertHistoryInFocus(history, id, client, done).then(idHistorySave => {
                if(idHistorySave==id){
                    logger.notice("insertCompleteHistoryInFocus - Se ha creado la historia en la base de datos 'histories' se procede a la creación de su contenido");
                    //Si tiene contenidos, guardaremos los contenidos de la historia
                    if(history.contents){
                        insertContentsInFocus(history.contents, idHistorySave, client, done).then(contentsSave => {
                            if(contentsSave==history.contents.length){
                                logger.notice("insertCompleteHistoryInFocus - Se han creado los contenidos en la base de datos 'contents_histories'");
                                resolve(idHistorySave)
                            }else{
                                logger.error('insertCompleteHistoryInFocus - Error guardando los contenidos de la historia');
                                reject('insertCompleteHistoryInFocus - Error guardando los contenidos de la historia');
                                return;
                            }
                        }).catch(error => {
                            logger.error('insertCompleteHistoryInFocus - Error guardando la historia:', error);
                            reject(error);
                            return;
                        });
                    //Si no tiene contenidos, habremos finalizado el gurdado de la historia
                    }else{
                        resolve(idHistorySave)
                    }
                }else{
                    logger.error('insertCompleteHistoryInFocus - Error guardando la historia');
                    reject('insertCompleteHistoryInFocus - Error guardando la historia');
                    return;
                }
            }).catch(error => {
                logger.error('insertCompleteHistoryInFocus - Error guardando la historia:', error);
                reject(error);
                return;
            });
        } catch (error) {
            logger.error('insertCompleteHistoryInFocus - Error guardando historia en BBDD:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Function that insert a history (with/witout contents) in the table histories
 * @param {*} history 
 * @param {*} id 
 * @param {*} client 
 * @param {*} done 
 */
var insertHistoryInFocus = function insertHistoryInFocus(history, id, client, done) {
    return new Promise((resolve, reject) => {
        try {
            const shouldAbort = (err) => {
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.error('insertHistoryInFocus - Error rolling back client', err.stack)
                        }
                        done();
                    })
                }
                return !!err;
            }

            logger.notice('insertHistoryInFocus - Se inicia la transacción de creación de una nueva historia en base de datos FOCUS');

            const queryHistory = {
                text: dbQueries.DB_FOCUS_INSERT_FOCUS_HISTORY,
                values: [id, history.state, history.title, history.description, history.email, history.id_reference, history.main_category, history.secondary_categories]
            };
            client.query(queryHistory, (err, resultHistory) => {
                if (shouldAbort(err)) {
                    logger.error('insertHistoryInFocus - Error guardando historia:', err);
                    reject(err);
                    return;
                } else {
                    var idHistory=resultHistory.rows[0].id;
                    resolve(idHistory)
                }
            })
            
        } catch (error) {
            logger.error('insertHistoryInFocus - Error guardando historia en BBDD:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Function that insert history's contents in the table contents_histories
 * @param {*} contents 
 * @param {*} idHistory 
 * @param {*} client 
 * @param {*} done 
 */
var insertContentsInFocus = function insertContentsInFocus(contents, idHistory, client, done) {
    return new Promise((resolve, reject) => {
        try {
            const shouldAbort = (err) => {
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.error('insertContentsInFocus - Error rolling back client', err.stack)
                        }
                        done();
                    })
                }
                return !!err;
            }

            logger.notice('insertContentsInFocus - Se inicia la transacción de creación de los contenidos en base de datos FOCUS');

            var sqlContents =  dbQueries.DB_FOCUS_INSERT_FOCUS_CONTENTS_HISTORY;
            var valuesContents= (contents).map(item => [item.title, item.description, item.id_graph, idHistory])
            client.query(format(sqlContents, valuesContents), (err, resultContents) => {
                if (shouldAbort(err)) {
                    logger.error('insertContentsInFocus - Error guardando contenidos:', err);
                    reject(err);
                    return;
                } else {
                    var contentsInsert = resultContents.rowCount
                    resolve(contentsInsert)
                }
            })
        } catch (error) {
            logger.error('insertContentsInFocus - Error guardando los contenidos en BBDD:', error);
            reject(error);
            return;
        }
    });
    
}

/**
 * Main function for get an history by her id
 * @param {*} id 
 */
var getCompleteHistoryInFocus = function getCompleteHistoryInFocus(id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('getCompleteHistoryInFocus - Error de conexión obteniendo la historia:',err.stack);
                    reject(err)
                    return;
                }
                getHistoryInFocus(id, pool, done).then(historySelect => {
                    if(historySelect.id==id){
                        getContentInFocus(historySelect, pool, done).then(contents => {
                            historySelect.contents=contents
                            logger.notice('getCompleteHistoryInFocus - Obtención de historia finalizada')
                            resolve(historySelect);
                        }).catch(error => {
                            logger.error('getCompleteHistoryInFocus - Error al obtener los contenidos de la historia', error);
                            reject(error);
                            return;
                        });
                    }else{
                        logger.error('getCompleteHistoryInFocus - Error al obtener la historia');
                        reject('getCompleteHistoryInFocus - Error al obtener la historia');
                        return;
                    }
                }).catch(error => {
                    logger.error('getCompleteHistoryInFocus - Error al obtener la historia', error);
                    reject(error);
                    return;
                });
            });
        } catch (error) {
            logger.error('getCompleteHistoryInFocus - Error obteniendo la historia', error);
            reject(error);
            return;
        }
    });
};

/**
 * Function that get history of  history table
 * @param {*} id 
 * @param {*} pool 
 * @param {*} done 
 */
var getHistoryInFocus = function getHistoryInFocus(id, pool, done) {
    return new Promise((resolve, reject) => {
        try {
            logger.notice('getHistoryInFocus - Se inicia la transacción de búsqueda de la historia en base de datos FOCUS');
            
            const queryHistory = {
                text: dbQueries.DB_FOCUS_GET_HISTORY,
                values: [id]
            }
            //Se busca la historia introducida como parámetro en la tabla histories
            pool.query(queryHistory, (err, result) => {
                if (err) {
                    done()
                    logger.error('getHistoryInFocus - Error obteniendo la historia',err.stack);
                    reject(err)
                    return;
                } else {
                    //Si tiene un resultado, obtenemos la historia y la devolvemos
                    if(result.rows.length==1 ){
                        logger.info('getHistoryInFocus - Id historia recuperada: ' + result.rows[0].id);
                        var historySelect=result.rows[0]
                        resolve(historySelect)
                    }else{
                        done()
                        logger.error(getHistoryInFocus - 'Error obteniendo la historia, id no encontrado');
                        reject("getHistoryInFocus - Id de historia no encontrado")
                        return;
                    }
                }
            })
        } catch (error) {
            logger.error('getHistoryInFocus - Error obteniendo la historia en BBDD:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Function that get history's contents of a history in contents table
 * @param {*} historySelect 
 * @param {*} pool 
 * @param {*} done 
 */
var getContentInFocus = function getContentInFocus(historySelect, pool, done) {
    return new Promise((resolve, reject) => {
        try {
            logger.notice('getHistoryInFocus - Se inicia la transacción de búsqueda de la historia en base de datos FOCUS');
            const queryContent = {
                text: dbQueries.DB_FOCUS_GET_CONTENTS_HISTORIES_PARTICULAR_HISTORY,
                values: [historySelect.id]
            }
            //obtenemos los contenidos de la historia
            pool.query(queryContent, (err, result) => {
                done()
                if (err) {
                    logger.error('getHistoryInFocus - Error obteniendo los contenidos de la historia:',err.stack);
                    reject(err)
                    return;
                } else {
                    logger.info('getHistoryInFocus - Contenidos recuperados ');
                    var contents=result.rows
                    resolve(contents)
                }
            });
        } catch (error) {
            logger.error('getHistoryInFocus - Error obteniendo la historia en BBDD:', error);
            reject(error);
            return;
        }
    });
};

/**
 * Main function for get details histories 
 */
var getDetailHistoriesInCampus = function getDetailHistoriesInCampus() {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error("getDetailHistoriesInCampus - Error en la conexión obteniendo los detalles de las historias:", err.stack);
                    reject(err)
                    return;
                }

                const queryHistories = {
                    text: dbQueries.DB_FOCUS_GET_HISTORIES,
                    rowMode: constants.SQL_RESULSET_FORMAT
                }

                pool.query(queryHistories, (err, result) => {
                    done()
                    if (err) {
                        logger.error('getDetailHistoriesInCampus - Error obteniendo los detalles de historias:',err.stack);
                        reject(err)
                        return;
                    } else {
                        logger.notice('getDetailHistoriesInCampus - Obtención de detalles de historias finalizada')
                        var resumeHistories=result.rows
                        resolve(resumeHistories)
                    }
                });
            });
                
        } catch (error) {
            logger.error('getDetailHistoriesInCampus - Error obteniendo el detalle de historias:', error);
            reject(error);
            return;
        }
    });
};


/**
 * Main function for delete an history
 * @param {*} id 
 */
var deletePrincipalHistoryInFocus = function deletePrincipalHistoryInFocus(id) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('deletePrincipalHistoryInFocus - Error de conexión para borrar historia:',err.stack);
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

                logger.notice('deletePrincipalHistoryInFocus - Se inicia la transacción de borrado de una historia en base de datos FOCUS');

                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                        return;
                    } else {
                        deleteCompleteHistoryInFocus(id, client, done).then(idDelete => {
                            if(idDelete){
                                client.query('COMMIT', (commitError) => {
                                    done();
                                    if (commitError) {
                                        logger.error('deleteHistoryInFocus - Error eliminando la historia:', commitError);
                                        reject(commitError);
                                        return;
                                    } else {
                                        logger.notice('deleteHistoryInFocus - Eliminación de historia finalizada')
                                        resolve(idDelete);
                                    }
                                });
                            }else{
                                logger.error('deleteHistoryInFocus - Error eliminando la historia');
                                reject('deleteHistoryInFocus - Error eliminando la historia');
                                return;
                            }
                        }).catch(error => {
                            logger.error('deleteHistoryInFocus - Error eliminando la historia: ', error);
                            reject(error);
                            return;
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('deleteHistoryInFocus - Error eliminando la historia: ', error);
            reject(error);
            return;
        }
    });
    
};

/**
 * Function that delete a history (with/witout contents) in the BBDD
 * @param {*} id 
 * @param {*} client 
 * @param {*} done 
 */
var deleteCompleteHistoryInFocus = function deleteCompleteHistoryInFocus(id, client, done){
    return new Promise((resolve, reject) => {
        logger.notice("deleteHistoryInFocus - Se ha borrado la historia");

        try {
            //Borramos los contenidos en la BBDD (por la relación existente)
            deleteContentsInFocus(id, client, done).then(deleteContents => {
                if(deleteContents){
                    logger.notice("deleteCompleteHistoryInFocus - Se han eliminado los contenidos de la base de datos contents_histories correspondientes a la historia");
                    //Una vez borrados los contenidos, se puede borrar la historia
                    deleteHistoryInFocus(id, client, done).then(deleteHistory => {
                        if(deleteHistory){
                            logger.notice("deleteCompleteHistoryInFocus - Se ha eliminado la historia en la base de datos 'histories'");
                            resolve(id)
                        }else{
                            logger.error('deleteCompleteHistoryInFocus -  Error eliminando la historia en la BBDD');
                            reject('deleteCompleteHistoryInFocus -  Error eliminando la historia en la BBDD');
                            return;
                        }
                    }).catch(error => {
                        logger.error('deleteCompleteHistoryInFocus -  Error eliminando la historia en la BBDD:', error);
                        reject(error);
                        return;
                    });
                }else{
                    logger.error('deleteCompleteHistoryInFocus -  Error eliminando los contenidos en la BBDD');
                    reject('deleteCompleteHistoryInFocus -  Error eliminando los contenidos en la BBDD');
                    return;
                }
            }).catch(error => {
                logger.error('deleteCompleteHistoryInFocus -  Error eliminando los contenidos en la BBDD:', error);
                reject(error);
                return;
            });
        } catch (error) {
            logger.error('deleteCompleteHistoryInFocus -  Error en el proceso de eliminación de una historia en la BBDD:', error);
            reject(error);
            return;
        }
    });
}

/**
 * Function that delete history'contents of the table 'contents_histories' in the BBDD
 * @param {*} id 
 * @param {*} client 
 * @param {*} done 
 */
var deleteContentsInFocus = function deleteContentsInFocus(id, client, done){
    return new Promise((resolve, reject) => {
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
    
        try {
            const queryDeleteContents = {
                text: dbQueries.DB_ADMIN_DELETE_FOCUS_CONTENT_BY_ID_HISTORY,
                values: [id]
            };
            //borrar contenidos
            client.query(queryDeleteContents, (err, resultDeleteContents) => {
                if (shouldAbort(err)) {
                    logger.error('deleteContentsInFocus - Error borrando los contenidos de la historia:', err);
                    reject(err);
                    return;
                } else {
                    logger.notice("deleteContentsInFocus - Se han borrado los posibles contenidos asociados a una historia, se procede a borrar la historia en la base de datos 'histories' se procede a la creación de su contenido");
                    resolve(true)
                }
            })
        } catch (error) {
            logger.error('deleteContentsInFocus - Error eliminando los conteidos en BBDD:', error);
            reject(error);
            return;
        }
    });
}

/**
 *  Function that delete history of the table 'histories' in the BBDD
 * @param {*} id 
 * @param {*} client 
 * @param {*} done 
 */
var deleteHistoryInFocus = function deleteHistoryInFocus(id, client, done){
    return new Promise((resolve, reject) => {
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
        console.log()
    
        try {
            const queryDeleteHistory = {
                text: dbQueries.DB_ADMIN_DELETE_FOCUS_HISTORY,
                values: [id]
            };
            //borra historia
            client.query(queryDeleteHistory, (err, resultDeleteHistory) => {
                if (shouldAbort(err)) {
                    logger.error('deleteHistoryInFocus - Error borrando la historia:', err);
                    reject(err);
                    return;
                } else {
                    if(resultDeleteHistory.rowCount==1){
                        console.log(resultDeleteHistory)
                        logger.notice("deleteHistoryInFocus - Se ha borrado la historia");
                        resolve(true)
                    }else{
                        logger.error('deleteHistoryInFocus - Error borrando la historia en BBDD:');
                        reject('deleteHistoryInFocus - Error borrando la historia en BBDD:');
                        return;
                    }
                }
            });
        } catch (error) {
            logger.error('deleteHistoryInFocus - Error borrando la historia en BBDD:', error);
            reject(error);
            return;
        }
    });

    
    

}

/**
 * Main function for update an  history
 * @param {*} history 
 */
var updatePrincipalHistoryInFocus = function updatePrincipalHistoryInFocus(history) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((err, client, done) => {
                if (err) {
                    logger.error('updatePrincipalHistoryInFocus - Error de conexión para actualizar historia:',err.stack);
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

                logger.notice('updatePrincipalHistoryInFocus - Se inicia la transacción de actualización de una historia en base de datos FOCUS');

                client.query('BEGIN', (err) => {
                    if (shouldAbort(err)) {
                        reject(err);
                        return;
                    } else {
                        deleteCompleteHistoryInFocus(history.id, client, done).then(idDelete => {
                            if(idDelete){
                                insertCompleteHistoryInFocus(history, history.id, client, done).then(idHistorySave => {
                                    client.query('COMMIT', (commitError) => {
                                        done();
                                        if (commitError) {
                                            logger.error('updatePrincipalHistoryInFocus - Error creando historia:', commitError);
                                            reject(commitError);
                                            return;
                                        } else {
                                            logger.notice('updatePrincipalHistoryInFocus - Creación de historia finalizada')
                                            resolve(idHistorySave);
                                        }
                                    });
                                }).catch(error => {
                                    logger.error('updatePrincipalHistoryInFocus - Error guardando la historia:', error);
                                    reject(error);
                                    return;
                                });
                            }else{
                                logger.error('updatePrincipalHistoryInFocus - Error eliminando la historia');
                                reject('updatePrincipalHistoryInFocus - Error eliminando la historia');
                                return;
                            }
                        }).catch(error => {
                            logger.error('updatePrincipalHistoryInFocus - Error eliminando la historia: ', error);
                            reject(error);
                            return;
                        });
                    }
                });
            });
        } catch (error) {
            logger.error('updatePrincipalHistoryInFocus - Error actualizando la historia: ', error);
            reject(error);
            return;
        }
    });
    
};

/**
 * Función que comprueba que una historia cumple los requisitos
 * @param {*} history 
 */
var correctNewHistory = function correctNewHistory(history) {
    if(!history.title){
        return false;
    }else{
        return true;
    }
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

/**
 * Función que encuentra un token no usado en la BBDD
 */
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