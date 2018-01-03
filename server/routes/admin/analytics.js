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
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
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
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'success': false,
            'error': error
        });
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
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
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
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
            return;
        });

        getAllFiles().then(reloadLogstashResponse => {
            for (var i = 0; i < reloadLogstashResponse.length; i++) {
                createPipeline(reloadLogstashResponse[i]);
            }
            createPipelineConf(reloadLogstashResponse);
        }).catch(error => {
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
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
        }).catch(error => {
            res.json({ 'status': constants.REQUEST_ERROR_INTERNAL_ERROR, 'error': error });
            return;
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
                if (client) {
                    client.query(queryDb, (insertLogstashQueryError, insertLogstashQueryResponse) => {
                        done();
                        if (insertLogstashQueryError) {
                            reject(insertLogstashQueryError);
                        } else {
                            resolve(insertLogstashQueryResponse.rows[0].id_logstash);
                        }
                    })
                }
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
                if (client) {
                    client.query(queryDb, (updateLostashQueryError, updateLogstashQueryResponse) => {
                        done();
                        if (updateLostashQueryError) {
                            reject(updateLostashQueryError);
                        } else {
                            resolve(updateLogstashQueryResponse);
                        }
                    })
                }
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
                if (client) {
                    client.query(queryDb, (deleteLostashQueryError, deleteLogstashQueryResponse) => {
                        done();
                        if (deleteLostashQueryError) {
                            reject(deleteLostashQueryError);
                        } else {
                            resolve(deleteLogstashQueryResponse);
                        }
                    })
                }
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
                if (client) {
                    client.query(queryDb, (reloadLogstashQueryError, reloadLogstashQueryResponse) => {
                        done();
                        if (reloadLogstashQueryError) {
                            reject(reloadLogstashQueryError);
                        } else {
                            resolve(reloadLogstashQueryResponse);
                        }
                    })
                }
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
    var name = String(logstash.portal_name).trim().split(" ").join("_");
    var data = {
        "portal": String(name),
        "delay": String(logstash.delay),
        "vista": String(logstash.view),
        "url": String(logstash.url),
        "pattern": String(name).toLowerCase()
    };

    var pipeline = compiledTemplate(data);

    if (!fs.existsSync(logstashPath + '/LogStashPipelines')) {
        fs.mkdirSync(logstashPath + '/LogStashPipelines');
    }

    fs.writeFileSync(logstashPath + '/LogStashPipelines/' + name + '.conf', pipeline);
}

var deletePipeline = function deletePipeline(logstash) {
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var name = String(logstash.portal_name).trim().split(" ").join("_");
    fs.unlinkSync(logstashPath + '/LogStashPipelines/' + name + '.conf')
}

var createPipelineConf = function createPipelineConf(logstashs) {
    var logstashPath = constants.ANALYTICS_LOGSTASH_PATH;
    var templatePath = path.join(__dirname, '..', '..', 'conf', 'analytics_templates');

    var pipelineTemplate = fs.readFileSync(String(templatePath) + '/pipelines_template.yml');

    var compiledTemplate = Handlebars.compile(String(pipelineTemplate));

    logstashs.forEach(function (item) {
        var name = String(item.portal_name).trim().split(" ").join("_");
        item.portal_name = name;
    });

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
                if (client) {
                    client.query(queryDb, (reloadLogstashQueryError, reloadLogstashQueryResponse) => {
                        done();
                        if (reloadLogstashQueryError) {
                            reject(reloadLogstashQueryError);
                        } else {
                            resolve(reloadLogstashQueryResponse.rows);
                        }
                    })
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = router;