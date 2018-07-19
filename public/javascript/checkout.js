'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Checkout.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

 function GETHandler(request, response) {
   console.log("Checkout gethandler entered");
   var fs = require('fs');
   fs.readFile('./public/html/checkout.html', function(err, data) {
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
   console.log("Checkout posthandler entered");
 } // end POSTHandler
