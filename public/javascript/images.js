'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Images.js entered!");
    if(request.method === "GET") GETHandler(request, response);
  }
}

/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function GETHandler(request, response) {
  console.log("Images gethandler entered");

  let path_arr = require('./utils.js').getSubPath(request);
  console.log("path arr is: "+path_arr);
  if(path_arr.length === 2) {
    var fs = require('fs');
    fs.readFile(`./public/images/${path_arr[1]}`, function(err, data) {
      if(err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'image/gif'});
        // response.write(data);
        response.end(data, 'binary');
      }
    });
  }
}


 /************************************************************************
  *************************** HELPER FUNCTIONS ***************************
  ************************************************************************/
