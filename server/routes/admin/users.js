'use strict'

const express = require('express');
const router = express.Router();
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get('/users', function (req, res, next) {
    const query = {
        text: 'SELECT * FROM manager.users',
        rowMode: 'array'
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        done();
        if (err) {
            logger.error(err.stack);
            throw err;
        }
        client.query(query, (err, res) => {
            done();
            if (err) {
                logger.error(err.stack);
            } else {
                logger.info(res.rows);
            }
        });
    });
});

module.exports = router;
