'use strict';

module.exports = {

	doing: function(request, response, data) {
		if(request.url === "/signedIn") {
			var si = require("./DBManager");
			var validationPromise = si.validate(data);
			validationPromise.then(function(validated) {
				if(validated) {
					console.log("Validated!");
					response.writeHead(301,
						{Location: 'http://localhost:8124/menu'}
					);
					/* From documentation, after a "finish" event, no more events will be
					  emitted on the response object */
					response.end();
				} else {
					/* Not validated, maybe do some frontend response or send to
					   loginError.html or the like */
					response.writeHead(301,
						{Location: 'http://localhost:8124'}
					);
					response.end();
				}
			}, function(err) {
				console.log("Error from Promise: "+err)
			});
		} else {
			// Deal with other URLs here
		}
	} // End doing

} // End exports
