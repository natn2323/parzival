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

      // /* Trying to do some smart URL assignments */
      // var path = require('path');
      // var parsed_path = path.parse(request.url);
      // var filename = parsed_path['name']+'.js';
      // var filepath = path.join(__dirname, filename);

      // An array representing the URL
      var url_split_path = require('url')
        .parse(request.url, true)
        .pathname
        .split('/')
        .slice(1, this.length);
      console.log("Original url is: "+url_split_path);

      // // A dictionary-representation of the query string
      // var url_query = require('url')
      //   .parse(request.url, true)
      //   .query; // this is more important in URL handlers

      /* Preventing direct access to /menu, etc. without first starting at
         login screen by checking the 'referer', i.e. the previous page.
         Might be an issue later when we have more pages linked together. */
       let base = url_split_path[0],
           file = "./" + base + ".js",
           filepath = require('path').join(__dirname, file);

       if(base === "/") {
         response.writeHead(301,
           {Location: 'http://localhost:8124/login'}
         );
         response.end();

       } else if(base === "favicon.ico") {
         console.log("Favicon requested!"); // Will eventually deal with this
         response.writeHead(200);
         response.end();

       } else if(require('fs').existsSync(filepath)) {
         require(file).handle(request, response, passed_data);

       } else {
         console.log("Bad URL: "+request.url);
         response.writeHead(404);
         response.end("<html><body>This page doesn't exist!</body></html>");

       }
    }) // on end
  } // end serve
} // end of file
