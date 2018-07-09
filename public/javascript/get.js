'use strict';

module.exports = {

	do: function(request, response) {
		var fs = require('fs');
		if(request.url === "/") {
			fs.readFile('./public/html/signIn.html', function(err, data) {
				if(err) {
					throw err;
				} else {
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write(data);
					response.end();
				}
			});
		} else if (request.url === "/favicon.ico") {
			console.log("Favicon requested!");
		}	else if(request.url === "/menu") {	// Typical format to deal with GET requests
			fs.readFile('./public/html/menu.html', function(err, data) {
				if(err) {
					throw err;
				} else {
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write(data);
					response.end();
				}
			});
		} else {
			console.log("Request URL was "+request.url+" but this does page does not exist! (404)");
		}
	} // End do

} // End exports
