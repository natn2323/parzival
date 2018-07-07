'use strict';

module.exports = {

	doing: function(request, response, data) {
		if(request.url === "/signedIn") {
			// Perhaps use 'let' instead of 'var'
			var si = require("./DBManager");
			var result = si.validate(data);
		} else {
			// Deal with other URLs here
		}
	} // End doing

} // End exports
