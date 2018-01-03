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
router.get('/analytics/files', function (req, res, next) {
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