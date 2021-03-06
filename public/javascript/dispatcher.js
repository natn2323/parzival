'use strict';

/* Code within the module.exports property is public and can be accessed from
	 other modules */
module.exports = {
  serve: function(request, response) {
    var requestBody = '',
        passed_data,
        config = require('../../config.json');

    request.on('data', function(data) {
      requestBody += data;
    }); // on data

    request.on('end', function() {
      /* Parse data based on content-type */
      if(request.headers['content-type'] === 'application/json') {
        passed_data = JSON.parse(requestBody);
      } else {
        var qs = require('querystring');
        passed_data = qs.parse(requestBody);
      }

      // An array representing the URL
      let url = require('url'),
          req_url = url.parse(request.url, true),
          url_split_path = req_url.pathname.split('/').slice(1, this.length),
          base = url_split_path[0],
          file = "./" + base + ".js",
          filepath = require('path').join(__dirname, file);

      if(base === "" ) { // This means you're accessing '/'
        let config = require('../../config.json');
        response.writeHead(301,
          {Location: config.protocol+'://'+config.hostname+':'+config.server_port+'/login'}
        );
        response.end();

      } else if(base === "favicon.ico") {
        console.log("Favicon requested!"); // Will eventually deal with this
        response.writeHead(200);
        response.end();

      } else if(require('fs').existsSync(filepath)
        && base === "images") {
        require('./images.js').handle(request, response, passed_data);

      } else if(require('fs').existsSync(filepath)
        && base === "css") {
        require('./css.js').handle(request, response, passed_data);

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
