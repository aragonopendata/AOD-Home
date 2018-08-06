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
const multer  = require('multer')
var storage = multer.memoryStorage()
const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        let path = '../../../assets/public/contenido-general/apps';
        if(fs.existsSync(path+file.originalname)){
            fs.remove(path+file.originalname);
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
        text: 'SELECT * from campus.events',
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
 router.get(constants.API_URL_ADMIN_CAMPUS_ENTRYS + "/:id", function (req, res, next) {
    var id = req.params.id;
     const query = {
        text: 'SELECT * from campus.contents WHERE id = $1',
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
 router.post(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
     if(!content.name){
        logger.error('Input Error', 'Name not found');
        res.json({ status: 400, error: 'Incorrect Input, name not found' });
        return;
    }
     var nowDate = new Date();
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    
    const query = {
        text: 'INSERT INTO campus.events (name, description, date) VALUES($1, $2, $3)',
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
                res.json({ status: 200, message: "Evento creado"});
            }
        });
    });
});
 router.put(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
    var id = content.id;
     if((!content.name && !content.description) || !id || content.name == ""){
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }
     const query = {
        text: 'UPDATE campus.events SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3',
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
                res.json({ status: 200, message: "Evento Actualizado"});
            }
        });
    });
    
});
 router.post(constants.API_URL_ADMIN_CAMPUS_ENTRYS, upload.single('thumbnail'), function (req, res, next) {
    
    var content = req.body;
     const query = {
        text: 'INSERT INTO campus.contents (title, description, url, thumbnail, format, type, platform, event) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
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
                res.json({ status: 200, message: "Entrada creada"});
            }
        });
    });
});
 router.put(constants.API_URL_ADMIN_CAMPUS_EVENTS, function (req, res, next) {
    var content = req.body;
    var id = content.id;
     if((!content.title && !content.description && !content.url && !content.thumbnail) || !id){
        logger.error('Input Error', 'Incorrect input');
        res.json({ status: 400, error: 'Incorrect Input' });
        return;
    }
     const query = {
        text: 'UPDATE campus.events SET' + 
                'title = COALESCE($1, title),' +
                'description = COALESCE($2, title),, ' +
                'url = COALESCE($3, title),, ' +
                'thumbnail = COALESCE($4, title),, ' +
                'format = COALESCE($5, title),, ' +
                'type = COALESCE($6, title),, ' +
                'platform = COALESCE($7, title),, ' +
                'event = COALESCE($8, title), ' +
                'WHERE id = $9',
        values: [content.title, content.description, content.url, req.file, content.format, content.type, content.platform, content.event, id],
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
                res.json({ status: 200, message: "Evento Actualizado"});
            }
        });
    });
    
});
 module.exports = router; 