// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
var datasets = require('./server/routes/datasets');
var topics = require('./server/routes/topics');
var orgs = require('./server/routes/orgs');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api/datasets', datasets);
app.use('/api/topics', topics);
app.use('/api/orgs', orgs);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, function(){
    console.log('Server started on port ' + port);
})
