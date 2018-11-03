'use strict'; // "strict" mode disallows some unsafe coding practices

/* NPM modules */
const http = require('http');
const config = require('./config.json');

/* Additional server-side JavaScript modules */
const dispatcher = require('./public/javascript/dispatcher.js');
const utils = require('./public/javascript/utils.js');

/*
  Creating database or dataframe or whatever. Currently using sqlite3 and
  initializing database in memory
*/
require('./public/javascript/DBManager').getPool();

/*
  Starting backend HTTP server
*/
const serverPort = config.server_port;
const hostname = config.hostname;
const protocol = config.protocol;
const webAddress = protocol + '://' + hostname + ':' + serverPort;
utils.address(webAddress); // saving the web address; not currenty used

http.createServer(function (request, response) {
  dispatcher.serve(request, response);
}).listen(serverPort, hostname);

console.log(`Server running at ${hostname}: ${serverPort}`);
