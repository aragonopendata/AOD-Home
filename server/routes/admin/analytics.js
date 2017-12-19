const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
const fs = require('fs');
var path = require('path');
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
        createPipeline(logstash);
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

        getAllFiles().then(reloadLogstashResponse => {
            for(var i = 0; i < reloadLogstashResponse.length; i++) {
                createPipeline(reloadLogstashResponse[i]);
            }
            createPipelineConf(reloadLogstashResponse);
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
        let logstash;

        getAllFiles().then(reloadLogstashResponse => {
            for(var i = 0; i < reloadLogstashResponse.length; i++) {
                if(reloadLogstashResponse[i].id_logstash == logstashid){
                    logstash = reloadLogstashResponse[i];
                    deletePipeline(logstash);
                }                
            }
            reloadLogstashResponse.splice( reloadLogstashResponse.indexOf(logstash), 1 );
            createPipelineConf(reloadLogstashResponse);
        }).catch(error => {
            logger.error(error);
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': 'Recarga errónea' });
            return;
        });

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
        var portal_name = logstash.portal_name.toLowerCase().charAt(0).toUpperCase() + logstash.portal_name.toLowerCase().slice(1);
        
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
        var portal_name = logstash.portal_name.toLowerCase().charAt(0).toUpperCase() + logstash.portal_name.toLowerCase().slice(1);
        
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

var createPipeline = function createPipeline(logstash){
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var templatePath = path.join(__dirname, '..', '..', 'conf', 'analytics_templates');

    var pipelineTemplate;
    if(logstash.type == 'urchin'){
        pipelineTemplate = fs.readFileSync(String(templatePath) + '/Urchin_template.conf');        
    }
    if(logstash.type == 'analytics'){
        pipelineTemplate = fs.readFileSync(String(templatePath) + '/Analytics_template.conf');        
    }

    var compiledTemplate = Handlebars.compile(String(pipelineTemplate));
    var data = { 
        "portal": logstash.portal_name, 
        "delay": logstash.view,
        "vista": logstash.delay, 
        "url": logstash.url
    };
    
    var pipeline = compiledTemplate(data);

    if(!fs.existsSync(logstashPath + '/LogstashPipelines')){
        fs.mkdirSync(logstashPath + '/LogstashPipelines');
    }

    fs.writeFile(logstashPath + '/LogstashPipelines/' + logstash.portal_name + '.conf', pipeline, (err) => {
        if (err) throw err;
    });
}

var deletePipeline = function deletePipeline(logstash){
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    fs.unlinkSync(logstashPath + '/LogstashPipelines/' + logstash.portal_name + '.conf')
}

var createPipelineConf = function createPipelineConf(logstashs){
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var templatePath = path.join(__dirname, '..', '..', 'conf', 'analytics_templates');

    var pipelineTemplate = fs.readFileSync(String(templatePath) + '/pipelines_template.yml');        

    var compiledTemplate = Handlebars.compile(String(pipelineTemplate));
    var data = { 
        "logstashs": logstashs
    };
    
    var pipeline = compiledTemplate(data);

    fs.writeFile(logstashPath + '/LogstashApp/config/pipelines.yml', pipeline, (err) => {
        if (err) throw err;
    });
}

var getAllFiles = function getAllFiles(){
    return new Promise((resolve, reject) => {
        try {
            pool.connect(function(err,client,done) {
                const queryDb = {
                    text: dbQueries.DB_ADMIN_GET_LOGSTASH_CONF_ALL,
                    rowMode: constants.SQL_RESULSET_FORMAT_JSON
                };
                client.query(queryDb, (reloadLogstashQueryError, reloadLogstashQueryResponse) => {
                    if (reloadLogstashQueryError) {
                        reject(reloadLogstashQueryError);
                    } else {
                        resolve(reloadLogstashQueryResponse.rows);                    
                    }
                })
    
            })
        } catch (error) {
            logger.error('Error in route get Logstash', error);
        }
    })

}

module.exports = router;