'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Menu.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}


/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

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

} // end GETHandler

function POSTHandler(request, response, data) {
  console.log("Menu posthandler entered");

  // An array representing the URL
  var url_split_arr = require('url')
    .parse(request.url, true)
    .pathname
    .split('/');
  var url_split_arr_length = url_split_arr.length;
  var url_split_path = url_split_arr.slice(1, url_split_arr_length);
  var base = url_split_path[0];

  processOrderHandler(request, response, data);
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

function processOrderHandler(request, response, data) {
  var orderPromise = processOrder(data);
  orderPromise.then(function(ordered) {
    if(ordered) {
      console.log("Menu items ordered!");
      response.writeHead(301,
        {Location: 'http://localhost:8124/reviewOrder'}
      );
      response.end();

    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('<html><body>Something went wrong while ordering!</body></html>')
      response.end();

    }
  }, function(err) {
    console.log("Error on orderPromise: "+err);

  }); // end orderPromise
} // end processOrderHandler

function processOrder(data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    for(let i = 0; i < data['content'].length; i++) {
      let unit = data['content'][i];

      db.run("INSERT INTO orderedItems "
        + "(itemName, quantity, unitPrice, username) VALUES"
        + "($itemName, $quantity, $unitPrice, $username)",
        {
          $itemName: unit.item,
          $quantity: unit.quantity,
          $unitPrice: unit.price,
          $username: 'temporaryUser'
        },
        function(err) {
          if(!err) {
            // Could do some counting--if only I could get it to work
          } else {
            reject(err);
          }
        }
      ); // end run

    } // end for
    resolve(true);

  }); // end return
} // end processOrder
