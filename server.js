// DEPENDENCIES
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const constants = require('./server/util/constants');

//CORS USE
const corsHeaders = require('./server/conf/cors-headers');
//LOG SETTINGS
const logConfig = require('./server/conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

// API ROUTES
var datasets = require('./server/routes/web/datasets');
var tags = require('./server/routes/web/tags');
var topics = require('./server/routes/web/topics');
var organizations = require('./server/routes/web/organizations');
var contents = require('./server/routes/web/contents');
var campus = require('./server/routes/web/campus');
var usersAdmin = require('./server/routes/admin/users');
var rolesAdmin = require('./server/routes/admin/roles');
var contentsAdmin = require('./server/routes/admin/contents');
var datasetsAdmin = require('./server/routes/admin/datasets');
var topicsAdmin = require('./server/routes/admin/topics');
var tagsAdmin = require('./server/routes/admin/tags');
var organizationsAdmin = require('./server/routes/admin/organizations');
var aodCore = require('./server/routes/admin/aod-core')
var logstash = require('./server/routes/admin/analytics')
var analytics = require('./server/routes/web/analytics')
//var campusAdmin = require('./server/routes/admin/campus');

// API ROUTES 
var authenticate = require('./server/routes/authenticate'); 
var verifyToken = require('./server/util/verifyToken'); 

// EXPRESS APP
const app = express();
// Cors Response headers
app.use(corsHeaders.permission);
// Parsers for POST data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.redirect(constants.EXPRESS_NODE_REDIRECT_ROUTING_URL);
});

// Set our api routes
app.use(constants.API_BASE_URL_SECURITY, authenticate);
app.use(constants.API_BASE_URL_WEB, datasets);
app.use(constants.API_BASE_URL_WEB, tags);
app.use(constants.API_BASE_URL_WEB, topics);
app.use(constants.API_BASE_URL_WEB, organizations);
app.use(constants.API_BASE_URL_WEB, contents);
app.use(constants.API_BASE_URL_WEB, campus);
app.use(constants.API_BASE_URL_WEB, analytics);
app.use(constants.API_BASE_URL_ADMIN, verifyToken, usersAdmin);
app.use(constants.API_BASE_URL_ADMIN, rolesAdmin);
app.use('/api/admin', contentsAdmin);
app.use(constants.API_BASE_URL_ADMIN, verifyToken, datasetsAdmin);
app.use(constants.API_BASE_URL_ADMIN, verifyToken, tagsAdmin);
app.use(constants.API_BASE_URL_ADMIN, topicsAdmin);
app.use(constants.API_BASE_URL_ADMIN, verifyToken, organizationsAdmin);
app.use(constants.API_BASE_URL_ADMIN, aodCore);
app.use(constants.API_BASE_URL_ADMIN, verifyToken, logstash);
//app.use('/api/admin', campusAdmin);

// PORT FROM ENVIRONMENT
const port = process.env.PORT || constants.EXPRESS_NODE_STARTING_PORT;
app.set('port', port);

// CREATE HTTP SERVER
const server = http.createServer(app);

// SERVER LISTENING.
app.listen(port, function () {
    logger.info('Server started on port ' + port);
})
