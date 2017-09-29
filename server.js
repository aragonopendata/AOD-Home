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
//var campus = require('./server/routes/web/campus');
var usersAdmin = require('./server/routes/admin/users');
//var rolesAdmin = require('./server/routes/admin/roles');
//var contentsAdmin = require('./server/routes/admin/contents');
//var datasetsAdmin = require('./server/routes/admin/datasets');
//var tagsAdmin = require('./server/routes/admin/datasets');
//var organizationsAdmin = require('./server/routes/admin/organizations');
//var campusAdmin = require('./server/routes/admin/campus');

// OTHER UTILITIES
var login = require('./server/routes/login');

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
app.use(constants.API_BASE_URL_WEB, datasets);
app.use(constants.API_BASE_URL_WEB, tags);
app.use(constants.API_BASE_URL_WEB, topics);
app.use(constants.API_BASE_URL_WEB, organizations);
app.use(constants.API_BASE_URL_WEB, contents);
//app.use('/api/web', campus);
app.use(constants.API_BASE_URL_ADMIN, usersAdmin);
//app.use('/api/admin', rolesAdmin);
//app.use('/api/admin', contentsAdmin);
//app.use('/api/admin', datasetsAdmin);
//app.use('/api/admin', tagsAdmin);
//app.use('/api/admin', organizationsAdmin);
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
