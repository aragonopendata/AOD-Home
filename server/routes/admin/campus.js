const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const constants = require('../../util/constants');
const utils = require('../../util/utils');
const dbQueries = require('../../db/db-queries');
const http = require('http');
const proxy = require('../../conf/proxy-conf');
const request = require('request');
//Multer for receive form-data
const multer = require('multer')
var storage = multer.memoryStorage()
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let path = '../../../assets/public/contenido-general/apps';
            if (fs.existsSync(path + file.originalname)) {
                fs.remove(path + file.originalname);
            }
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            callback(null, file.originalname);
        }
    })
});
// FormData for send form-data
const formData = require('form-data');
const fs = require('fs-extra');
//DB SETTINGS
const db = require('../../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

router.get(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_EVENTS,
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });
});

router.post(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;

    if (!content.name) {
        logger.error('Input Error', 'Name not found');
        res.json({ status: 400, error: 'Incorrect Input, name not found' });
        return;
    }

    var date = new Date().toISOString();

    const query = {
        text: dbQueries.DB_ADMIN_INSERT_CAMPUS_EVENTS,
        values: [content.name, content.description, date]
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Nuevo evento creado');
                res.json({ status: 200, message: "Evento creado" });
            }
        });
    });
});

router.put(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
    var id = content.id;

    if ((!content.name && !content.description) || !id || content.name == "") {
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }

    const query = {
        text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_EVENTS,
        values: [content.name, content.description, content.id],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Evento Actualizado');
                res.json({ status: 200, message: "Evento Actualizado" });
            }
        });
    });

});


router.get(constants.API_URL_ADMIN_CAMPUS_ENTRYS + "/:id", function (req, res, next) {
    var id = req.params.id;

    const query = {
        text: dbQueries.DB_ADMIN_GET_CAMPUS_ENTRYS,
        values: [id],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Filas devueltas: ' + result.rows.length);
                res.json(result.rows);
            }
        });
    });

});
router.post(constants.API_URL_ADMIN_CAMPUS_ENTRYS, upload.single('thumbnail'), function (req, res, next) {

    var content = req.body;

    if (!content.title || content.title == "") {
        logger.error('Input Error', 'Incorrect input, title required');
        res.json({ status: 400, error: 'Incorrect Input, title required' });
        return;
    }

    const query = {
        text: dbQueries.DB_ADMIN_INSERT_CAMPUS_ENTRYS,
        values: [content.title, content.description, content.url, req.file, content.format, content.type, content.platform, content.event]
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Nueva entrada creada');
                res.json({ status: 200, message: "Entrada creada" });
            }
        });
    });
});


router.put(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
    var id = content.id;

    if ((content.title && content.title == '') || !id) {
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }

    const query = {
        text: dbQueries.DB_ADMIN_UPDATE_CAMPUS_ENTRYS,
        values: [content.title, content.description, content.url, req.file,
        content.format, content.type, content.platform, content.event, id],
        rowMode: constants.SQL_RESULSET_FORMAT
    };

    pool.on('error', (err, client) => {
        logger.error('Error en la conexión con base de datos', err);
        process.exit(-1);
    });

    pool.connect((err, client, done) => {
        if (err) {
            logger.error(err.stack);
            res.json({ status: 500, 'error': err });
            return;
        }
        pool.query(query, (err, result) => {
            done();
            if (err) {
                logger.error(err.stack);
                res.json({ status: 500, 'error': err });
                return;
            } else {
                logger.info('Evento Actualizado');
                res.json({ status: 200, message: "Evento Actualizado" });
            }
        });
    });

});


module.exports = router; 