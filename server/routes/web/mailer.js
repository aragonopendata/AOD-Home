const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const email = require('../../../node_modules/emailjs/email');
const smtp = require('../../conf/smtp-conf');
const smtpServer = smtp.getSMTPConnectionSettings();

var server 	= email.server.connect({
    user:    smtpServer.user, 
    password:smtpServer.password, 
    host:    smtpServer.host, 
    port:    smtpServer.port,
    tls:     true
});

/**
 * Servicio para enviar la inscripción en el evento "Prestacion de Servicios Públicos en el Mundo Digital" por correo
 */
router.post('/inscripcionPrestacionServPubli', function (req, res, next) {
    try {
        var message	= {
            from:	    "opendata@aragon.es", 
            to:		    "opendata@aragon.es",
            subject:	"[Inscripción] Prestación de Servicios Públicos en el Mundo Digital",
            attachment: 
            [
                {data:"<html><table style='border: 1px solid #ddd;'><tbody><tr style='border: 1px solid #ddd;'><td style='padding: 15px; font-weight: bold; background-color: aliceblue;'>Nombre</td><td style='padding: 15px;text-align: left;'>"+ req.body.name +"</td></tr><tr style='border: 1px solid #ddd;'><td style='padding: 15px; font-weight: bold; background-color: aliceblue;'>Apellidos</td><td style='padding: 15px;text-align: left;'>"+ req.body.surname +"</td></tr><tr style='border: 1px solid #ddd;'><td style='padding: 15px; font-weight: bold; background-color: aliceblue;'>e-mail</td><td style='padding: 15px;text-align: left;'>"+ req.body.email +"</td></tr><tr style='border: 1px solid #ddd;'><td style='padding: 15px; font-weight: bold; background-color: aliceblue;'>Organización - Empresa</td><td style='padding: 15px;text-align: left;'>"+ req.body.orgEmpresa +"</td></tr><tr style='border: 1px solid #ddd;'><td style='padding: 15px; font-weight: bold; background-color: aliceblue;'>Puesto que desempeña</td><td style='padding: 15px;text-align: left;'>"+ req.body.puesto +"</td></tr></tbody></html>", 
                alternative:true}
            ]
        };
    
        // send the message and get a callback with an error or details of the message that was sent
        server.send(message, function(err, message) {
            if(err){
                console.log('Problemas al enviar el mensaje -> ' + err + ' // ' + message);
                res.json({
                    'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
                    'success': false,
                    'error': err
                });
            }else if(message){
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'success': true
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'success': false,
            'error': error
        });
    }
});

module.exports = router;