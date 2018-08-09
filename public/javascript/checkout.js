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

  let path_arr = require('./utils.js').getSubPath(request);
  if(path_arr.length === 1 && path_arr[0] === "checkout") {
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
  } else if(path_arr.length === 2
    && path_arr[0] == "checkout"
    && path_arr[1] == "order") {
      getOrderHandler(request, response);

  } // end else if
 } // end GETHandler

 function POSTHandler(request, response, data) {
   console.log("Checkout posthandler entered");

   let path_arr = require('./utils.js').getSubPath(request);
 } // end POSTHandler


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
