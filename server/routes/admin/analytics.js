const express = require('express');
const router = express.Router();
const constants = require('../../util/constants');
const logstashUtils = require('../../util/logstash');
const elasticUtils = require('../../util/elasticsearch');

/** GET ALL LOGSTASH CONFIG */
router.get('/logstash/files', function (req, res) {
    try {
        logstashUtils.getAllFilesDB().then(files => {
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'message': JSON.stringify(files)
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        })
    }
});

/** NEW LOGSTASH */
router.post('/logstash/insert', function (req, res) {
    try {
        logstashUtils.insertLogstashDB(req.body).then((id) => {
            logstashUtils.createPipeline(req.body, id);
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'message': 'Correcto'
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

/** UPDATE LOGSTASH */
router.put('/logstash/insert/:logid', function (req, res) {
    try {
        var portal = req.body;
        var id = req.params.logid;
        logstashUtils.updateLogstashDB(portal, id).then(() => {
            logstashUtils.createPipeline(portal, id);
            elasticUtils.updatePortal(portal, id);
            res.json({
                'status': constants.REQUEST_REQUEST_OK,
                'message': 'OK'
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

/** ENABLE LOGSTASH */
router.get('/logstash/enable/:logid', function (req, res) {
    try {
        var id = req.params.logid;
        logstashUtils.enableLogstashDB(id).then(() => {
            logstashUtils.getAllFilesEnabledDB().then(files => {
                logstashUtils.reloadPipelinesConf(files);
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'message': 'OK'
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

/** DISABLE LOGSTASH */
router.get('/logstash/disable/:logid', function (req, res) {
    try {
        var id = req.params.logid;
        logstashUtils.disableLogstashDB(id).then(() => {
            logstashUtils.getAllFilesEnabledDB().then(files => {
                logstashUtils.reloadPipelinesConf(files);
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'message': 'OK'
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

/** DELETE LOGSTASH */
router.delete('/logstash/delete/:logid', function (req, res) {
    try {
        var id = req.params.logid;
        logstashUtils.deleteLogstashDB(id).then(() => {
            logstashUtils.getAllFilesEnabledDB().then(files => {
                logstashUtils.reloadPipelinesConf(files);
                logstashUtils.deletePipeline(id);
                elasticUtils.deletePortal(id);
                res.json({
                    'status': constants.REQUEST_REQUEST_OK,
                    'message': 'OK'
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

/** RELOAD DAYS  */
router.post('/logstash/reload', function (req, res) {
    try {
        var id = req.body.id;
        var fromT = req.body.from;
        var toT = req.body.to;

        var from = new Date(fromT);
        var to = new Date(toT);

        logstashUtils.getFileDB(id).then(portal => {
            for (var date = from; date <= to; date.setDate(date.getDate() + 1)) {
                elasticUtils.reloadPortal(portal, date);
            }
        }).catch(() => {
        });

        res.json({
            'status': constants.REQUEST_REQUEST_OK,
            'message': 'OK'
        });

    } catch (error) {
        res.json({
            'status': constants.REQUEST_ERROR_INTERNAL_ERROR,
            'message': error
        });
    }
});

module.exports = router;
