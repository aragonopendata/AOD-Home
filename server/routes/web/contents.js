'use strict'

const express = require('express');
const router = express.Router();
//DB SETTINGS
const db = require('../../db/db-connection');
const dbQueries = require('../../db/db-queries');
const pool = db.getPool();

//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get('/static-content/open-data', function (req, res, next) {
    let sectionTitle = 'INFORMACIÓN';
    let sectionSubtitle = 'OPEN DATA';
    const query = {
        text: 'SELECT sec.id as sectionId, sec.title as sectionTitle, sec.subtitle as sectionSubtitle '
                 + ', sec.description as sectionDescription, cnt.content_order as contentOrder ' 
                 + ', cnt.title as contentTitle, cnt.title AS contentTitle, cnt.content as contentText ' 
              + 'FROM manager.sections sec '
              + 'JOIN manager.static_contents cnt '
                + 'ON sec.id = cnt.id_section '
             + 'WHERE sec.title = $1 and sec.subtitle = $2 '
             + 'ORDER BY cnt.content_order ASC',
        values: [sectionTitle, sectionSubtitle],
        rowMode: 'json'
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err});
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err});
                return;
            } else {
                var json = JSON.stringify(result.rows);
                logger.info(json);
                res.json(result.rows);
            }
        });
    });
});

router.get('/static-content/applications', function (req, res, next) {
    
});

router.get('/static-content/events', function (req, res, next) {
    
});

router.get('/static-content/collaboration', function (req, res, next) {
    
});

router.get('/static-content/developers', function (req, res, next) {
    
});

router.get('/static-content/apis', function (req, res, next) {
    
});

router.get('/static-content/sparql', function (req, res, next) {
    
});

router.get('/static-content/sparql-client?graph=:graph&query=:query', function (req, res, next) {
    
});

module.exports = router;