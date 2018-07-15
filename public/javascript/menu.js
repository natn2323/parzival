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
  console.log("Menu posthandler entered. Contains: ");
  var db_man = require("./DBManager.js");
  for(var a in data) {
    console.log(a);
    var authentication_tuple = db_man.getCurrentUsernameAndPassword();
    var db_man_result = db_man.processOrder(a, authentication_tuple[0]);
    console.log(authentication_tuple[0]);
    console.log(authentication_tuple[1]);
    console.log(db_man_result);

  }

} // end function
