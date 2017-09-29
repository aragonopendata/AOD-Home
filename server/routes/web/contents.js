'use strict'

const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();

//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get(constants.API_URL_STATIC_CONTENT_INFO_OPEN_DATA, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_OPEN_DATA;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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

router.get(constants.API_URL_STATIC_CONTENT_INFO_APPS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_APPS;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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

router.get(constants.API_URL_STATIC_CONTENT_INFO_EVENTS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_INFO;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_EVENTS;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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

router.get(constants.API_URL_STATIC_CONTENT_INFO_COLLABORATION, function (req, res, next) {
    
});

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_DEVELOPERS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_DEVELOPERS;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_APIS, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_APIS;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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

router.get(constants.API_URL_STATIC_CONTENT_TOOLS_SPARQL, function (req, res, next) {
    let sectionTitle = constants.STATIC_CONTENT_SECTION_TITLE_TOOLS;
    let sectionSubtitle = constants.STATIC_CONTENT_SUBSECTION_TITLE_SPARQL;
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
        rowMode: constants.SQL_RESULSET_FORMAT
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