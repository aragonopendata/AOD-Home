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
        getAllFiles().then(reloadLogstashResponse => {
            res.json(JSON.stringify(reloadLogstashResponse));
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
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
            throw error;
        });
    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
    }
});

/** UPDATE LOGSTASH */
router.put('/logstash/insert/:logid', function (req, res, next) {
    try {
        var logstash = req.body;
        var logstashid = req.params.logid;

        updateLogstash(logstash, logstashid).then(updateLogstashResponse => {
            createPipeline(logstash);
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Actualización correcta'
            });
        }).catch(error => {
            throw error;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
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
            throw error;
        });

        getAllFiles().then(reloadLogstashResponse => {
            for (var i = 0; i < reloadLogstashResponse.length; i++) {
                createPipeline(reloadLogstashResponse[i]);
            }
            createPipelineConf(reloadLogstashResponse);
        }).catch(error => {
            throw error;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
    }
});

/** DELETE LOGSTASH */
router.delete('/logstash/delete/:logid', function (req, res, next) {
    try {
        var logstashid = req.params.logid;
        let logstash;

        getAllFiles().then(reloadLogstashResponse => {
            for (var i = 0; i < reloadLogstashResponse.length; i++) {
                if (reloadLogstashResponse[i].id_logstash == logstashid) {
                    logstash = reloadLogstashResponse[i];
                    deletePipeline(logstash);
                }
            }
            reloadLogstashResponse.splice(reloadLogstashResponse.indexOf(logstash), 1);
            createPipelineConf(reloadLogstashResponse);
        }).catch(err => {
            throw err;
        });

        deleteLogstash(logstashid).then(deleteLogstashResponse => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'success': true,
                'result': 'Eliminación correcta'
            });
        }).catch(error => {
            throw error;
        });

    } catch (error) {
        res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
    }
});


/** INSERT KIBANA */
router.post('/kibana/insert', function (req, res, next) {
    try {
        var kibana = req.body;

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


var insertLogstash = function insertLogstash(logstash) {
    return new Promise((resolve, reject) => {
        try {
            var portal_name = logstash.portal_name.toLowerCase().charAt(0).toUpperCase() + logstash.portal_name.toLowerCase().slice(1);

            var type = logstash.type;
            var view = logstash.view;
            var delay = logstash.delay;
            var url = logstash.url;

            pool.connect((connError, client, done) => {

                if (connError) {
                    reject(connError);
                }

                const queryDb = {
                    text: dbQueries.DB_ADMIN_INSERT_LOGSTASH,
                    values: [portal_name, type, view, delay, url]
                };

                client.query(queryDb, (insertLogstashQueryError, insertLogstashQueryResponse) => {
                    if (insertLogstashQueryError) {
                        reject(insertLogstashQueryError);
                    } else {
                        resolve(insertLogstashQueryResponse.rows[0].id_logstash);
                    }
                })
            })
        } catch (error) {
            reject(error);
        }
    });
}

var updateLogstash = function updateLogstash(logstash, idlog) {
    return new Promise((resolve, reject) => {
        try {
            var portal_name = logstash.portal_name.toLowerCase().charAt(0).toUpperCase() + logstash.portal_name.toLowerCase().slice(1);

            var type = logstash.type;
            var view = logstash.view;
            var delay = logstash.delay;
            var url = logstash.url;

            pool.connect((connError, client, done) => {

                if (connError) {
                    reject(connError);
                }

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
        } catch (error) {
            reject(error);
        }
    });
}

var deleteLogstash = function deleteLogstash(idlog) {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((connError, client, done) => {

                if (connError) {
                    reject(connError)
                }

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
        } catch (error) {
            reject(error);
        }
    });
}

var reloadLogstash = function reloadLogstash() {
    return new Promise((resolve, reject) => {
        try {
            pool.connect((connError, client, done) => {

                if (connError) {
                    reject(connError)
                }

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
        } catch (error) {
            reject(error);
        }
    });
}

var createPipeline = function createPipeline(logstash) {
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var templatePath = path.join(__dirname, '..', '..', 'conf', 'analytics_templates');

    var pipelineTemplate;
    if (logstash.type == 'urchin') {
        pipelineTemplate = fs.readFileSync(String(templatePath) + '/Urchin_template.conf');
    }
    if (logstash.type == 'analytics') {
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

    if (!fs.existsSync(logstashPath + '/LogStashPipelines')) {
        fs.mkdirSync(logstashPath + '/LogStashPipelines');
    }

    fs.writeFileSync(logstashPath + '/LogStashPipelines/' + logstash.portal_name + '.conf', pipeline);
}

var deletePipeline = function deletePipeline(logstash) {
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    fs.unlinkSync(logstashPath + '/LogStashPipelines/' + logstash.portal_name + '.conf')
}

var createPipelineConf = function createPipelineConf(logstashs) {
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var templatePath = path.join(__dirname, '..', '..', 'conf', 'analytics_templates');

    var pipelineTemplate = fs.readFileSync(String(templatePath) + '/pipelines_template.yml');

    var compiledTemplate = Handlebars.compile(String(pipelineTemplate));
    var data = {
        "logstashs": logstashs
    };

    var pipeline = compiledTemplate(data);

    fs.writeFile(logstashPath + '/LogStashApp/config/pipelines.yml', pipeline);
}

var getAllFiles = function getAllFiles() {
    return new Promise((resolve, reject) => {
        try {
            pool.connect(function (err, client, done) {

                if (err) {
                    reject(err)
                }

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
            reject(error)
        }
    })
}

module.exports = router;