const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
const fs = require('fs');
const Handlebars = require('handlebars');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** GET ALL LOGSTASH CONFIG */
router.get('/logstash/files', function (req, res, next) {
    try {
        pool.connect(function(err,client,done) {
            const queryDb = {
                text: dbQueries.DB_ADMIN_GET_LOGSTASH_CONF_ALL,
                rowMode: constants.SQL_RESULSET_FORMAT_JSON
            };
            client.query(queryDb, function (err, result) {
                done()
                if (err) {
                  // pass the error to the express error handler
                  return next(err);
                }
                res.json(JSON.stringify(result.rows));
            })

        })
    } catch (error) {
        logger.error('Error in route get Logstash', error);
    }
});

/** NEW LOGSTASH */
router.post('/logstash/insert', function (req, res, next) {
    try {
        var logstash = req.body;

        insertLogstash(logstash).then(insertLogstashResponse => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Inserción correcta'
            });
        }).catch(error => {
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Inserción errónea' });
            return;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Inserción errónea' });
        return;
    }
});

/** UPDATE LOGSTASH */
router.put('/logstash/insert/:logid', function (req, res, next) {
    try {
        var logstash = req.body;
        var logstashid = req.params.logid;

        updateLogstash(logstash,logstashid).then(updateLogstashResponse => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Actualización correcta'
            });
        }).catch(error => {
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Actualización errónea' });
            return;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Actualización errónea' });
        return;
    }
});

/** RELOAD LOGSTASH */
router.get('/logstash/reload', function (req, res, next) {
    try {

        reloadLogstash().then(reloadLogstashResponse => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Recarga correcta'
            });
        }).catch(error => {
            logger.error(error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Recarga errónea' });
            return;
        });

    } catch (error) {
        logger.error(error);
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Recarga errónea' });
        return;
    }
});

/** DELETE LOGSTASH */
router.delete('/logstash/delete/:logid', function (req, res, next) {
    try {
        var logstashid = req.params.logid;

        deleteLogstash(logstashid).then(deleteLogstashResponse => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Eliminación correcta'
            });
        }).catch(error => {
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Eliminación errónea' });
            return;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Eliminación errónea' });
        return;
    }
});

var insertLogstash = function insertLogstash(logstash) {
    return new Promise((resolve, reject) => {
        var portal_name = logstash.portal_name;
        
        var type = logstash.type;
        var view = logstash.view;
        var delay = logstash.delay;
        var url = logstash.url;

        pool.connect((connError, client, done) => {

            const queryDb = {
                text: dbQueries.DB_ADMIN_INSERT_LOGSTASH,
                values: [portal_name, type, view, delay, url]
            };

            client.query(queryDb, (insertLostashQueryError, insertLogstashQueryResponse) => {
                if (insertLostashQueryError) {
                    reject(insertLostashQueryError);
                } else {
                    resolve(insertLogstashQueryResponse.rows[0].id_logstash);                    
                }
            })
        });
    });
}

var updateLogstash = function updateLogstash(logstash, idlog) {
    return new Promise((resolve, reject) => {
        var portal_name = logstash.portal_name;
        
        var type = logstash.type;
        var view = logstash.view;
        var delay = logstash.delay;
        var url = logstash.url;

        pool.connect((connError, client, done) => {

            const queryDb = {
                text: dbQueries.DB_ADMIN_UPDATE_LOGSTASH,
                values: [portal_name, type, view, delay, url, idlog]
            };

            client.query(queryDb, (updateLostashQueryError, updateLogstashQueryResponse) => {
                if (updateLostashQueryError) {
                    reject(updateLostashQueryError);
                } else {
                    resolve(updateLogstashQueryResponse);                    
                }
            })
        });
    });
}

var deleteLogstash = function deleteLogstash(idlog) {
    return new Promise((resolve, reject) => {

        pool.connect((connError, client, done) => {

            const queryDb = {
                text: dbQueries.DB_ADMIN_DELETE_LOGSTASH,
                values: [idlog]
            };

            client.query(queryDb, (deleteLostashQueryError, deleteLogstashQueryResponse) => {
                if (deleteLostashQueryError) {
                    reject(deleteLostashQueryError);
                } else {
                    resolve(deleteLogstashQueryResponse);                    
                }
            })
        });
    });
}

var reloadLogstash = function reloadLogstash() {
    return new Promise((resolve, reject) => {

        pool.connect((connError, client, done) => {

            const queryDb = {
                text: dbQueries.DB_ADMIN_RELOAD_LOGSTASH,
            };

            client.query(queryDb, (reloadLogstashQueryError, reloadLogstashQueryResponse) => {
                if (reloadLogstashQueryError) {
                    reject(reloadLogstashQueryError);
                } else {
                    resolve(reloadLogstashQueryResponse);                    
                }
            })
        });
    });
}

module.exports = router;