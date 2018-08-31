'use strict';

/*
* 1. order confirmation (success/failure message)
* 2. order number
*/

module.exports = {
  handle: function(request, response) {
    console.log("Confirmation.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

 function GETHandler(request, response) {
   console.log("Confirmation gethandler entered");
   var fs = require('fs');
   fs.readFile('./public/html/confirmation.html', function(err, data) {
     if(err) {
       throw err;
     } else {
       response.writeHead(200, {'Content-Type': 'text/html'});
       response.write(data);
       response.end();
     }
   });

 } // end GETHandler

 function POSTHandler(request, response, data) {
   console.log("Confirmation posthandler entered");
 } // end POSTHandler
