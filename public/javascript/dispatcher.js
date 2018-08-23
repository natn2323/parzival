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

      // An array representing the URL
      var url_split_path = require('url')
        .parse(request.url, true)
        .pathname
        .split('/')
        .slice(1, this.length);

      /* Preventing direct access to /menu, etc. without first starting at
         login screen by checking the 'referer', i.e. the previous page.
         Might be an issue later when we have more pages linked together. */
      let base = url_split_path[0],
        file = "./" + base + ".js",
        filepath = require('path').join(__dirname, file);

      if(base === "" ) { // This means you're accessing '/'
        response.writeHead(301,
          {Location: 'http://localhost:8124/login'}
        );
        response.end();

      } else if(base === "favicon.ico") {
        console.log("Favicon requested!"); // Will eventually deal with this
        response.writeHead(200);
        response.end();

      } else if(require('fs').existsSync(filepath)
        && base === "newUser") {
        require('./newUser.js').handle(request, response, passed_data);

      } else if(require('fs').existsSync(filepath)) {
        let authenticator = require('./userAuthentication.js'),
            cookie = request.headers['cookie'];

        authenticator.authenticateCookie(cookie)
          .then(() => require(file).handle(request, response, passed_data))
          .catch(err => {
            console.log(`Erroneous request: ${err} -- Redirect to login!`);
            let login = require('./login.js');
            login.handle(request, response, passed_data);

          }); // end promise chain

      } else {
        console.log("Bad URL: "+request.url);
        response.writeHead(404);
        response.end("<html><body>This page doesn't exist!</body></html>");

      }
    }) // on end
  } // end serve
} // end of file
