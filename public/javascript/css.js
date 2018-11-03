'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Css.js entered!");
    if(request.method === "GET") GETHandler(request, response);
  }
}

/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function GETHandler(request, response) {
  console.log("Css gethandler entered");

  let path_arr = require('./utils.js').getSubPath(request);
  console.log("path arr is: "+path_arr);
  if(path_arr.length === 2) {
    var fs = require('fs');
    fs.readFile(`./public/css/${path_arr[1]}`, function(err, data) {
      if(err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data);
        response.end();
      }
    });
  }
  // if(path_arr.length === 2 && path_arr[1] === "menu.css") {
  //   var fs = require('fs');
  //   fs.readFile('./public/css/menu.css', function(err, data) {
  //     if(err) {
  //       throw err;
  //     } else {
  //       response.writeHead(200, {'Content-Type': 'text/css'});
  //       response.write(data);
  //       response.end();
  //     }
  //   });
  // } else if (path_arr.length === 2 && path_arr[1] === "login.css") {
  //   var fs = require('fs');
  //   fs.readFile('./public/css/login.css', function(err, data) {
  //     if(err) {
  //       throw err;
  //     } else {
  //       response.writeHead(200, {'Content-Type': 'text/css'});
  //       response.write(data);
  //       response.end();
  //     }
  //   });
  // }
 } // end GETHandler

 /************************************************************************
  *************************** HELPER FUNCTIONS ***************************
  ************************************************************************/
