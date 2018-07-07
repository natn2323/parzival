'use strict';

module.exports = {

	do: function(request, response) {
		var fs = require('fs');
		console.log("GET made.");

		// Typical format to deal with GET requests
		/*if(request.url === "/") {

			fs.readFile('index.html', function(err, data) {
				if(err)
					throw err;
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.end(data);
			});

		}*/
	} // End do

} // End exports
