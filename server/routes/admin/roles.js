const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const dbQueries = require('../../db/db-queries');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get('/roles', function (req, res, next) {
    try {
        const query = {
            text: dbQueries.DB_ADMIN_GET_ROLES,
            rowMode: constants.SQL_RESULSET_FORMAT_JSON
        };

        pool.on('error', (error, client) => {
            logger.error('Error en la conexión con base de datos', err);
            process.exit(-1);
        });

        pool.connect((connError, client, done) => {
            done();
            if (connError) {
                logger.error(connError.stack);
                res.json({ status: 500, 'error': err});
                return;
            }
            client.query(query, (queryError, queryResult) => {
                done();
                if (queryError) {
                    logger.error(queryError.stack);
                    res.json({ status: 500, 'error': queryError});
                    return;
                } else {
                    res.json(queryResult.rows);
                }
            });
        });
    } catch (error) {
        logger.error('Error in roles admin');
    }
});

module.exports = router;
