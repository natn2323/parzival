'use strict';

/* Code within the module.exports property is public and can be accessed from
	 other modules */
module.exports = {
  serve: function(request, response) {
    var requestBody = '';

    request.on('data', function(data) {
        requestBody += data;
    }); // on data

    request.on('end', function() {
      var passed_data;

      /* Parse data based on content-type */
      if(request.headers['content-type'] === 'application/json') {
        passed_data = JSON.parse(requestBody);
      } else {
        var qs = require('querystring');
        passed_data = qs.parse(requestBody);
      }

      /* Trying to do some smart URL assignments */
      var path = require('path');
      var parsed_path = path.parse(request.url);
      var filename = parsed_path['name']+'.js';
      var filepath = path.join(__dirname, filename);

      /* Preventing direct access to /menu, etc. without first starting at
         login screen by checking the 'referer', i.e. the previous page.
         Might be an issue later when we have more pages linked together. */
      if(request.url === "/") {
        response.writeHead(301,
          {Location: 'http://localhost:8124/login'}
        );
        response.end();
      } else if(request.url === "/login") {
        var login_handler = require("./login.js");
        login_handler.handle(request, response, passed_data);

      } else if(request.url === "/newUser") {
        var new_user_handler = require("./newUser.js");
        new_user_handler.handle(request, response, passed_data);

      } else if(request.url === "/menu") {
        var menu_handler = require("./menu.js");
        menu_handler.handle(request, response, passed_data);

      } else if(request.url === "/reviewOrder" || request.url === "/reviewOrder/getItemOrder") {
        var review_handler = require("./reviewOrder.js");
        review_handler.handle(request, response, passed_data);

      } else if(request.url === "/checkout") {
        var checkout_handler = require("./checkout.js");
        checkout_handler.handle(request, response, passed_data);

      // } else if(request.url === "/confirmation") {
      //   var confirmation_handler = require("./confirmation.js");
      //   confirmation_handler.handle(request, response, passed_data);

      } else {
        // Could also have an error.js that deals with various errors
        console.log("Non-existent: "+filepath);

      }
    }) // on end
  } // end serve
} // end of file
