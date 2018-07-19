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

  // authorization was found on StackOverflow
  var auth = request.headers['authorization'];
  if(!auth) {
    response.statusCode = 401;
    response.setHeader('WWW-Authenticate', 'Basic realm="Authorized User"');
    response.end('<html><body>Authorization needed.</body></html>');

  } else if(auth) {

    var tmp = auth.split(' '); // auth format is: "Basic bmF0YW46TIz"
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();

    // console.log("Decoded authorization: "+plain_auth);

    var creds = plain_auth.split(':');
    var username = creds[0],
        password = creds[1];

    if(username == 'admin' && password == 'pass') {
      //response.statusCode = 200;
      dispatcher.serve(request, response); // This is the important part

    } else {
      response.statusCode = 401;
      response.setHeader('WWW-Authenticate', 'Basic realm="Authorized User"');
      response.end('<html><body>Wrong credentials.</body></html>');

    }
  }
}).listen(serverPort);

console.log('Server running at localhost: '+serverPort);
