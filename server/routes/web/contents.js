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

router.get('/static-content/info/open-data', function (req, res, next) {
    let sectionTitle = 'INFORMACIÓN';
    let sectionSubtitle = 'OPEN DATA';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText", cnt.target_url AS "targetUrl" ' 
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

router.get('/static-content/info/applications', function (req, res, next) {
    let sectionTitle = 'INFORMACIÓN';
    let sectionSubtitle = 'APLICACIONES';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText" ' 
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

router.get('/static-content/info/events', function (req, res, next) {
    let sectionTitle = 'INFORMACIÓN';
    let sectionSubtitle = 'EVENTOS';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText" ' 
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

router.get('/static-content/info/collaboration', function (req, res, next) {
    
});

router.get('/static-content/tools/developers', function (req, res, next) {
    let sectionTitle = 'HERRAMIENTAS';
    let sectionSubtitle = 'DESARROLLADORES';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText" ' 
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

router.get('/static-content/tools/apis', function (req, res, next) {
    let sectionTitle = 'HERRAMIENTAS';
    let sectionSubtitle = 'APIS';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText" ' 
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

router.get('/static-content/tools/sparql', function (req, res, next) {
    let sectionTitle = 'HERRAMIENTAS';
    let sectionSubtitle = 'SPARQL';
    const query = {
        text: 'SELECT sec.id as "sectionId", sec.title as "sectionTitle", sec.subtitle as "sectionSubtitle" '
                 + ', sec.description as "sectionDescription", cnt.content_order as "contentOrder" ' 
                 + ', cnt.title AS "contentTitle", cnt.content as "contentText" ' 
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

router.get('/static-content/tools/sparql-client?graph=:graph&query=:query', function (req, res, next) {
    
});

module.exports = router;