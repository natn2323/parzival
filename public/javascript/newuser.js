'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("newuser.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

function GETHandler(request, response) {
  var fs = require('fs');
    fs.readFile('./public/html/newuser.html', function(err, data) {
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
  console.log(data);
  
} // end function
