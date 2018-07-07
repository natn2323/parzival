'use strict';

/* Code within the module.exports property is public and can be Accessed from
	 other modules */
module.exports = {

	deal: function(request, response) {
		// Dealing with the GET requests
		if(request.method === "GET") {
				// Pass data to the appropriate function
		    var get = require('./get');
		    get.do(request, response);
		} else if(request.method === "POST") { // Dealing with the POST requests
			var qs = require('querystring');
			var requestBody = '';

			request.on('data', function(data) {
				requestBody += data;
			});

			request.on('end', function() {
				var formData = qs.parse(requestBody);
				var post = require('./post');

				// Pass data to the appropriate function
				post.doing(request, response, formData);
			});

		}
	} // End deal

} // End exports 
