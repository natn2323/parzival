#!/usr/bin/env node

'use strict';

var http = require("http");
var fs = require("fs");
var events = require("events");
//var run = require("./run.js");
var eventEmitter = new events.EventEmitter();

http.createServer(function (request, response) {
	fs.readFile('index.html', function(err, data) {
		// Send the HTTP header 
		// HTTP Status: 200 : OK
		// Content Type: text/plain
		response.writeHead(200, {'Content-Type': 'text/html'});

		response.write(data);
		return response.end();
	});
}).listen(8080);

// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');
console.log(__filename);
console.log(__dirname);

(function () {
	function hi() {
		alert("This is working!");
	}
})();