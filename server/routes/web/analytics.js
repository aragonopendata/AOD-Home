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

module.exports = router;