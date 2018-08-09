'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("ReviewOrder.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}


/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function GETHandler(request, response) {
  console.log("Review gethandler entered");

  let path_arr = require('./utils.js').getSubPath(request);
  if(path_arr.length === 1 && path_arr[0] === "reviewOrder") {
    var fs = require('fs');
    fs.readFile('./public/html/reviewOrder.html', function(err, data) {
      if(err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      }
    });

  } else if (path_arr.length > 1
    && path_arr[0] === "reviewOrder"
    && path_arr[1] === "order") {
    console.log("Post entered here!");
    getItemOrderHandler(request, response);

  } // end else if
} // end GETHandler

function POSTHandler(request, response, data) {
  console.log("reviewOrder POSTHandler entered!");

  let path_arr = require('./utils.js').getSubPath(request);
  if (path_arr.length === 2
    && path_arr[0] === "reviewOrder"
    && path_arr[1] === "makeOrder") {
    makeOrderHandler(request, response, data);

  } // end if
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

function makeOrderHandler(request, response, data) {
  let makePromise = makeOrder(request, response, data);
  makePromise.then(function(ordered) {
    if(ordered) {
      console.log("Reviewed order items!");
      response.writeHead(301,
        {Location: 'http://localhost:8124/checkout'}
      );
      response.end();

    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('<html><body>Something went wrong after reviewing!</body></html>');
      response.end();

    }
  }, function(err) {
    console.log("Error on makePromise: "+err);

  }); // end makePromise
} // end makeOrderHandler

function makeOrder(request, response, data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    for(let i = 0; i < data['content'].length; i++) {
      let unit = data['content'][i];
      // TODO: Add unit price, item prices, and total order price
      // Don't need to re-add items

      db.run("INSERT INTO orderedItems"
        + " (itemId, quantity) VALUES"
        + " ($itemId, $quantity);",
      {
        $itemId: unit.itemId,
        $quantity: unit.quantity
      },
      function(err) {
        if(!err) {
          // Could do something here
        } else {
          reject(err);
        }
      // })
      // .run("UPDATE orderedItems"
      //   + " SET orderedItems.itemName = menuItems.itemName,"
      //   + " orderedItems.unitPrice = menuItems.unitPrice"
      //   + " WHERE orderedItems.itemId = menuItems.itemId;",
      // function(err) {
      //   if(!err) {
      //     // Could do something here
      //   } else {
      //     reject(err);
      //   }
      // })
      // .run("UPDATE orderedItems"
      //   + " SET orderedItems.totalPricePerItem = unitPrice*quantity;",
      // function(err) {
      //   if(!err) {
      //     // Could do something here
      //   } else {
      //     reject(err);
      //   }
      // })
      // .run("UPDATE orderedItems"
      //   + " SET orderedItems.totalPriceOfOrder = totalPriceOfOrder + totalPricePerItem;",
      // function(err) {
      //   if(!err) {
      //     // Could do something here
      //   } else {
      //     reject(err);
      //   }
      }); // end run
    } // end for
    resolve(true);

  }); // end return
} // end makeOrder

function getItemOrderHandler(request, response) {
  // Handling the inline GET request
  if(request.headers['x-requested-with'] &&
      request.headers['x-requested-with'] === 'XMLHttpRequest') {

    // GET-ing the page involves orders based on menu page selections
    let username = require('./DBManager.js').getCurrentUsernameAndPassword()[0];

    let reviewPromise = getItemOrder(username); // username is being hardcoded
    reviewPromise.then(function(rows) {
      // Parsing data
      let dataToSubmit = {'content': []}
      for(let i = 0; i < rows.length; i++) {
        let unit = rows[i];
        dataToSubmit['content'].push({
          'itemId': unit.itemId,
          'itemName': unit.itemName,
          'unitPrice': unit.unitPrice,
          'quantity': unit.quantity
        });
      } // end for

      response.writeHead('200', {'Content-Type': 'application/json'});
      response.end(JSON.stringify(dataToSubmit));

    }, function(err) {
      console.log("Error on reviewPromise: "+err);
    }); // end promise
  } // end if
} // end getItemOrderHandler

function getItemOrder(username) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.all('SELECT menuItems.itemId, menuItems.itemName, menuItems.unitPrice, reviewItems.quantity'
      + ' FROM menuItems'
      + ' INNER JOIN reviewItems'
      + ' ON menuItems.itemId = reviewItems.itemId',
      function(err, rows) {
        if(err) {
          reject(err);
        } else if (rows.length>0) {
          console.log("Selecting items...");
          resolve(rows);
        } else if (rows.length===0) {
          resolve(false);
        }
      } // end callback
    ); // end query
  }); // end return

} // end getItemOrder
