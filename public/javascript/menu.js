'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Menu.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

function GETHandler(request, response) {
  console.log("Menu gethandler entered");
  var fs = require('fs');
  fs.readFile('./public/html/menu.html', function(err, data) {
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
  console.log("Menu posthandler entered");
  var db_man = require("./DBManager.js");
  var orderPromise = db_man.processOrder(data);

  orderPromise.then(function(ordered) {
    if(ordered) {
      // console.log("Menu items ordered!");
      // response.writeHead(301,
      //   {Location: 'http://localhost:8124/reviewOrder'}
      // );
      // response.end();
      response.writeHead(200);
      response.end();
    } else {
      // response.writeHead(200, {'Content-Type': 'text/html'});
      // response.write('<html><body>Something went wrong while ordering!</body></html>')
      // response.end();
      response.writeHead(501);
      response.end();
    }

  }, function(err) {
    console.log("Error on orderPromise: "+err);

  }); // end orderPromise
} // end function
