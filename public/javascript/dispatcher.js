'use strict';

/* Code within the module.exports property is public and can be accessed from
	 other modules */
module.exports = {
  serve: function(request, response) {
    var qs = require('querystring');
    var requestBody = '';

    request.on('data', function(data) {
        requestBody += data;
    }); // on data

    request.on('end', function() {
      var qs = require('querystring');
      var passed_data = qs.parse(requestBody);

      var path = require('path');
      var parsed_path = path.parse(request.url);
      var filename = parsed_path['name']+'.js';
      var filepath = path.join(__dirname, filename);

      var fs = require('fs');
      //console.log("Referer is undefined?: "+request.headers['referer']);
      /* Preventing direct access to /menu, etc. without first starting at
         login screen by checking the 'referer', i.e. the previous page.
         Might be an issue later when we have more pages linked together. */
      if(request.url === "/") {
        response.writeHead(301,
          {Location: 'http://localhost:8124/login'}
        );
        response.end();

      } else if(fs.existsSync(filepath)) {
          var referer = request.headers['referer'];
          if(referer) {
            /* This is blocking, synchronous code.
               Associating URL with JavaScript file. */
            var serving = require(filepath);
            serving.handle(request, response, passed_data);
          } else {
            fs.readFile('./public/html/login.html', function(err, data) {
              if(err) {
                throw err;
              } else {
                response.writeHead(200,
                  {'Content-Type': 'text/html'}
                );
                response.write(data);
                response.end();
              }
            });
          }

      } else {
        // Could also have an error.js that deals with various errors
        console.log("Non-existent: "+filepath);

      }
    }) // on end
  } // end serve
} // end of file
