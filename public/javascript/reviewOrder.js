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
  let config = require('../../config.json');
  
  insertOrder(request, response, data)
    .then(() => updateItemNames(request, response, data))
    .then(() => updateTotalPricePerItem(request, response, data))
    .then(() => {
      console.log("Updated items!");
      response.writeHead(301,
        {Location: config.protocol+'://'+config.hostname+':'+config.server_port+'/checkout'}
      );
      response.end();
    })
    .catch(err => {
      console.log("Caught error: "+err);
    }); // end promise chain
} // end makeOrderHandler

function insertOrder(request, response, data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    let cookie = "";
    if(request.headers && request.headers['cookie']) {
      cookie = request.headers['cookie'];
    }

    for(let i = 0; i < data['content'].length; i++) {
      let unit = data['content'][i];
      // TODO: Add unit price, item prices, and total order price
      // Don't need to re-add items

      if(parseInt(unit.quantity) <= 0
        || parseInt(unit.itemId) <= 0) {
        continue;
      } else {
        db.run("INSERT INTO orderedItems"
          + " (itemId, quantity, cookie) VALUES"
          + " ($itemId, $quantity, $cookie);",
        {
          $itemId: unit.itemId,
          $quantity: unit.quantity,
          $cookie: cookie
        },
        function(err) {
          if(err) {
            reject("SQLite3 insert error: "+err);
          } else {
            resolve();
          } // end else
        }); // end run
      } // end else
    } // end for
  }); // end return
} // end makeOrder

function updateItemNames(request, response, data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.run("UPDATE orderedItems"
      + " SET itemName ="
      + "     ("
      + "      SELECT menuItems.itemName"
      + "      FROM menuItems"
      + "      WHERE menuItems.itemId = orderedItems.itemId"
      + "     ),"
      + "     unitPrice ="
      + "     ("
      + "      SELECT menuItems.unitPrice"
      + "      FROM menuItems"
      + "      WHERE menuItems.itemId = orderedItems.itemId"
      + "     )"
      + " WHERE"
      + "     EXISTS "
      + "         ("
      + "          SELECT *"
      + "          FROM menuItems"
      + "          WHERE menuItems.itemId = orderedItems.itemId"
      + "         );",
      function(err) {
        if(err) {
          reject("SQLite3 first update error: "+err);
        // } else if(this.changes == 1) {
          // resolve();
        } else {
          // reject("SQLite3 second update error: "+err);
          resolve();
        } // end else
      } // end error
    ); // end run
  }); // end return
} // end updateItemNames

function updateTotalPricePerItem(request, response, data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.run("UPDATE orderedItems"
      + " SET totalPricePerItem = (SELECT round(unitPrice*quantity, 2));",
    function(err) {
      if(err) {
        reject("SQLite3 individual price error: "+err);
      } else {
        resolve();
      } // end else
    }) // end error
  }); // end return
} // end updateOrderPrices

function getItemOrderHandler(request, response) {
  // Handling the inline GET request
  if(request.headers['x-requested-with'] &&
      request.headers['x-requested-with'] === 'XMLHttpRequest') {

    let cookie = "";
    if(request.headers && request.headers['cookie']) {
      cookie = request.headers['cookie'];
    }

    let reviewPromise = getItemOrder(cookie);
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

function getItemOrder(cookie) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.all('SELECT'
      + '   menuItems.itemId,'
      + '   menuItems.itemName,'
      + '   menuItems.unitPrice,'
      + '   reviewItems.quantity'
      + ' FROM menuItems'
      + ' INNER JOIN reviewItems'
      + ' ON menuItems.itemId = reviewItems.itemId'
      + ' AND reviewItems.cookie = $cookie',
      {
        $cookie: cookie
      },
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
