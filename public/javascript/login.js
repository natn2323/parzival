'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Login.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

function GETHandler(request, response) {
  var fs = require('fs');
  fs.readFile('./public/html/login.html', function(err, data) {
    if(err) {
      throw err;
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    }
  });

} // end function

function POSTHandler(request, response, data) {
  var db_man = require("./DBManager.js");
  var validationPromise = db_man.validateLogin(data);
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
        {Location: 'http://localhost:8124/login'}
      );
      response.end();

    }
  }, function(err) {
    console.log("Error on validationPromise: "+err);

  }); // end validationPromise
} // end function
