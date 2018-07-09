'use strict'; // "strict" mode disallows some unsafe coding practices

/* NPM modules */
var http = require('http');
var fs = require('fs');

/* Additional server-side JavaScript modules */
var dispatcher = require('./public/javascript/dispatcher.js');

/*
  Creating database or dataframe or whatever. Currently using sqlite3 and
  initializing database in memory
*/
var database = require('./public/javascript/DBManager').init();

/*
  Starting backend HTTP server
*/
var serverPort = 8124;
http.createServer(function (request, response) {

  /* Passing HTTP requests and responses to our helper modules */
  dispatcher.deal(request, response);

}).listen(serverPort);

console.log('Server running at localhost: '+serverPort);
