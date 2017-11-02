'use strict'
const express = require('express');
const router = express.Router();
const fs = require('fs');
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");
const jwt = require('jsonwebtoken');
const constants = require('../util/constants');
//DB SETTINGS 
const db = require('../db/db-connection');
const pool = db.getPool();
//LOG SETTINGS
const logConfig = require('../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

//Authenticate 
router.post(constants.API_URL_AUTHENTICATE, function (req, res, next) {
    try {
        let user = req.body.username;
        // Gets password and encrypt it with SHA256 algorithm. After that, converts it in Base64 format.
        let password = SHA256(req.body.password).toString(CryptoJS.enc.Base64);
        const query = {
            text: 'SELECT usr.id AS "userId", usr.name AS "userName", usr.fullname AS "userFullName" '
                  + 'FROM manager.users usr ' 
                 + 'WHERE usr.name = $1 AND usr.password = $2 AND usr.active = true',
            values: [user, password],
            rowMode: 'json'
        };

        pool.on('error', (err, client) => {
            logger.error('Error en la conexión con base de datos', err);
            process.exit(-1);
        });

        pool.connect((err, client, done) => {
            done();
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
                }
                if (result && result.rows && result.rows.length > 0) {
                    logger.info(result.rows);
                    var data = {
                        exp: Math.floor(Date.now() / 1000) + (60 * 120),
                        username: user
                    };
                    var token = generateToken(data);
                    if (token) {
                        logger.error('Token: ' + token);
                        var json = JSON.stringify(result.rows);
                        logger.error('Filas: ' + json);
                        res.json({ status: 200, token: token, id: result.rows[0].userId, name: result.rows[0].userName, fullname: result.rows[0].userFullName });
                    } else {
                        res.json({ status: 200 });
                    }
                } else {
                    res.json({ status: 200 });
                }
            });
        });
    } catch (err) {
        logger.error('Error en autenticación: ' + err);
        res.json({ status: 500 });
    }
});

function generateToken(data) {
    try {
        // sign with RSA SHA256 
        var cert = fs.readFileSync('server/keys/private_unencrypted.pem');  // get private key 
        var token = jwt.sign(data, cert, { algorithm: 'RS256' });
        return token;
    } catch (err) {
        logger.error('Error generando token: ' + err);
        return null;
    }
}

module.exports = router;