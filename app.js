'use strict'; // "strict" mode disallows some unsafe coding practices

/* NPM modules */
var http = require('http');

/* Additional server-side JavaScript modules */
//var dispatcher = require('./public/javascript/dispatcher.js');
var dispatcher = require('./public/javascript/dispatcher.js');

/*
  Creating database or dataframe or whatever. Currently using sqlite3 and
  initializing database in memory
*/
require('./public/javascript/DBManager').getPool();

/*
  Starting backend HTTP server
*/
var serverPort = 8124;
http.createServer(function (request, response) {
  dispatcher.serve(request, response);
}).listen(serverPort);

console.log('Server running at localhost: '+serverPort);
