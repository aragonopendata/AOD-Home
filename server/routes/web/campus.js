'use strict'

const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();

//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get(constants.API_URL_CAMPUS_EVENTS, function (req, res, next) {
    var rows = 10;
    var start = 0;
    var text = '%%';
    if (req.query.rows && req.query.page) {
        rows = req.query.rows;
        start = (req.query.page * constants.CAMPUS_EVENTS_PER_PAGE);
    }
    if (req.query.text){
        text = '%'+req.query.text+'%';
    }
    
    if(req.query.type){
        var type = req.query.type;
        var textQuery = 'SELECT distinct evn.id AS "id", evn.name AS "name", evn.description AS "description", evn.date AS "date", sit.name as "site", count(*) OVER() AS total_count '
        + 'FROM campus.events evn '
        + 'join campus.events_sites evnsit on evn.id = evnsit.id_event  '
        + 'join campus.sites sit on evnsit.id_site = sit.id  '
        + 'join campus.contents cnt on evn.id = cnt.event '
        + 'where cnt."type" = $1 '
        + 'group by evn.id, evnsit.id_event, sit.name '
        + 'ORDER  BY evn."date" DESC '
        + 'LIMIT  $2 '
        + 'OFFSET $3 ';
        var valuesQuery = [type,rows, start];
    }else{
        var textQuery = 'SELECT evn.id AS "id", evn.name AS "name", evn.description AS "description", evn.date AS "date", sit.name as "site", count(*) OVER() AS total_count '
        + 'FROM campus.events evn '
        + 'join campus.events_sites evnsit on evn.id = evnsit.id_event  '
        + 'join campus.sites sit on evnsit.id_site = sit.id  '
        + 'where evn.name like $3 '
        + 'ORDER  BY evn."date" DESC '
        + 'LIMIT  $1 '
        + 'OFFSET $2 ';
        var valuesQuery = [rows, start, text];
    }

    const query = {
        text: textQuery,
        values: valuesQuery,
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

router.get(constants.API_URL_CAMPUS_CONTENTS_OF_EVENT, function (req, res, next) {
    const query = {
        text: 'select distinct cnt.id AS id, cnt.title AS title, cnt.description as description, cnt.url as url, encode(cnt.thumbnail, \'base64\') as thumbnail, '
        +'fmt.name as format_content, cnt.event as content_event '
                     +' FROM campus.contents cnt'
                     +' join campus.formats fmt'
                     +' on cnt.format = fmt.id'
                     +' join campus.events evt'
                     +' on cnt.format = fmt.id'
                     +' where cnt.event = $1',
        values: [req.query.id],
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

router.get(constants.API_URL_CAMPUS_TYPES, function (req, res, next) {
    var rows = 10;
    var start = 0;
    if (req.query.rows && req.query.page) {
        rows = req.query.rows;
        start = req.query.page;
    }
    
    const query = {
        text: 'SELECT typ.id AS "value", typ.name AS "label" '
        +'from campus.types typ', 
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

router.get(constants.API_URL_CAMPUS_CONTENTS_OF_EVENT, function (req, res, next) {
    const query = {
        text: 'select distinct cnt.id AS id, cnt.title AS title, cnt.description as description, cnt.url as url, encode(cnt.thumbnail, \'base64\') as thumbnail, '
        +'fmt.name as format_content, cnt.event as content_event '
                     +' FROM campus.contents cnt'
                     +' join campus.formats fmt'
                     +' on cnt.format = fmt.id'
                     +' join campus.events evt'
                     +' on cnt.format = fmt.id'
                     +' where cnt.event = $1',
        values: [req.query.id],
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

router.get(constants.API_URL_CAMPUS_EVENT + '/:eventName', function (req, res, next) {
    const query = {
        text: 'SELECT evn.id AS "id", evn.name AS "name", evn.description AS "description", evn.date AS "date", sit.name as "site" '
        +'FROM campus.events evn '
        +'join campus.events_sites evnsit on evn.id = evnsit.id_event '
        +'join campus.sites sit on evnsit.id_site = sit.id   '
        +'where evn.id = $1',
        values: [req.params.eventName],
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


router.get(constants.API_URL_CAMPUS_CONTENT + '/:contentName', function (req, res, next) {
    const query = {
        text: 'select cnt.id AS id, cnt.title AS title, cnt.description as description, cnt.url as url, '
        +'fmt.name as format, typ.name as "type", plt.name as platform, evn.id as "event_id", evn.name as "event_name" '
        +'FROM campus.contents cnt '
        +'join campus.formats fmt '
        +'on cnt.format = fmt.id '
        +'join campus.types typ '
        +'on cnt.type = typ.id '
        +'join campus.platforms plt '
        +'on cnt.platform = plt.id '
        +'join campus.events evn '
        +'on cnt.event = evn.id '
        +'where cnt.id = $1 ',
        values: [req.params.contentName],
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

router.get(constants.API_URL_CAMPUS_SPEAKERS + '/:contentName', function (req, res, next) {
    const query = {
        text: 'SELECT spk.id AS "id", spk.name AS "name" '
        + 'FROM campus.speakers spk '
        + 'join campus.contents_speakers cnsp '
        + 'on spk.id = cnsp.id_speaker '
        + 'where cnsp.id_content = $1 ',
        values: [req.params.contentName],
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

router.get(constants.API_URL_CAMPUS_TOPICS + '/:contentName', function (req, res, next) {
    const query = {
        text: 'SELECT top.id AS "id", top.name AS "name" '
        + 'FROM campus.topics top '
        + 'join campus.contents_topics cntop '
        + 'on top.id = cntop.id_topic '
        + 'where cntop.id_content = $1 ',
        values: [req.params.contentName],
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



module.exports = router;
