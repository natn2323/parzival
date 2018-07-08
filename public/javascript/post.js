'use strict';

module.exports = {

	doing: function(request, response, data) {
		if(request.url === "/signedIn") {
			// Perhaps use 'let' instead of 'var'
			var si = require("./DBManager");
			var validated = si.validate(data);
			console.log('validated is: '+validated);
			if (validated) {
				console.log('accesssed');
				var menu = require('public/html/menu.html');
				//response.location = 'menu.html'
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(menu);
				response.end();
			} else {
				//response.redirect('loginError.html');
			}
		} else {
			// Deal with other URLs here
		}
	} // End doing

} // End exports


