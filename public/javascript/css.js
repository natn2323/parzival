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
  if(path_arr.length === 2 && path_arr[1] === "menu.css") {
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
  } // end if
 } // end GETHandler

 /************************************************************************
  *************************** HELPER FUNCTIONS ***************************
  ************************************************************************/

function getOrderHandler(request, response) {
  // TODO: Handling the inline GET request
  if(request.headers['x-requested-with'] &&
      request.headers['x-requested-with'] === 'XMLHttpRequest') {

    let checkoutPromise = getOrder();
    checkoutPromise.then(function(rows) {
      // Parsing data
      let dataToSubmit = {'content': []};
      for(let i = 0; i < rows.length; i++) {
        let unit = rows[i];
        dataToSubmit['content'].push({
          'itemName': unit.itemName,
          'quantity': unit.quantity
        });
      } // end for
      console.log(rows);
      response.writeHead('200', {'Content-Type': 'application/json'});
      response.end(JSON.stringify(dataToSubmit));

    }, function(err) {
      console.log("Error on checkoutPromise: "+err);
    }); // end promise
  } // end if
} // end getOrderHandler

function getOrder() {
  return new Promise(function(resolve, reject) {
      var db = require('./DBManager.js').getPool();
      // TODO: Should be getting specific order
      db.all('SELECT * FROM orderedItems',
        function(err, rows) {
          if(err) {
            reject(err);
          } else if (rows.length>0) {
            console.log("Selecting items for checkout...");
            resolve(rows);
          } else if (rows.length===0) {
            resolve(false);
          }
        } // end callback
      ); // end query
  }); // end return

} // end getOrder
