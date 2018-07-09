'use strict';

module.exports = {

	doing: function(request, response, data) {
		if(request.url === "/signedIn") {
			// Perhaps use 'let' instead of 'var'
			var si = require("./DBManager");
			var validationPromise = si.validate(data);
			var validated = undefined;
			validationPromise.then(function(result) {
				validated = result;

				console.log("Promise validated: "+validated);
			}, function(err) {
				console.log("Error from Promise: "+err)
			});
			/*console.log("Validated is: "+validated);
			if (validated) {
				console.log("Validated!");
				/*var menu = require('public/html/menu.html');
				//response.location = 'menu.html'
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(menu);
				response.end();
			} else {
				//response.redirect('loginError.html');
				console.log("Not validated!");
			}*/
		} else {
			// Deal with other URLs here
		}
	} // End doing

} // End exports
