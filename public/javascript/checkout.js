'use strict';

/*
* 1. read-only list of their order
* 2. personal info (name, etc. from authentication)
* 3. submit order button
*/

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

  } else if(path_arr.length === 2
    && path_arr[0] === "checkout"
    && path_arr[1] === "submit") {
      confirmOrderHandler(request, response);
  } // end else if
 } // end GETHandler

 function POSTHandler(request, response, data) {
   console.log("Checkout posthandler entered");

   let path_arr = require('./utils.js').getSubPath(request);
 } // end POSTHandler


 /************************************************************************
  *************************** HELPER FUNCTIONS ***************************
  ************************************************************************/

function confirmOrderHandler(request, response) {

}

// TODO: Use this: update test set price = (select cast((price * 100) as int) / 100.0);
// in order to truncate all values who go beyond the hundredths place
// TODO: This won't be used here. Instead it will be used later in the workflow
// within the checkout page.
function updateTotalOrderPrice(request, response, data) {
  /* TODO: Follows the same logic as above basically. What you'll need to do is
    select the orders based on the username and on the latest entry. Then,
    sum the individual items based on these orders to find a total sum of
    the entire order. */
} // end updateTotalPriceOfOrder

/* Based on username, which will be passed along in header, or in a cookie to
   be associated with a username. */
function createOrderIds() {
  // 1. Insert orderId based on incrementing variable in orders table

  // 2. Update orderedItems.orderId field based on orders.orderId value

}

/* Want to check the necessary fields in the orderedItems table. You should
   actually check that every column in the associated orderId or username
   exists and is populated. */
function checkOrderFields() {
  // 1. Doing this will allow you to write a successful or unsuccessful message

}

function setStatusErr() {
  // 1. Tell the frontend that something went wrong and that the order was
  // cancelled, if the checkOrderFields() fails.
}

function setStatusNew() {
  // 1. Insert statusNew in orders table

  // 2. Update orderedItems.timeOrdered field based on orders.statusNew value
}

function setStatusCancelled() {
  // 1. Insert statusCancelled in orders table

  // 2. Update orderedItems.timeOrdered field based on orders.statusCancelled value
}

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

// TODO: select items based on cookie received from reviewOrder page
//  and
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
