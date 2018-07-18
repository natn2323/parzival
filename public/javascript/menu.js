'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Menu.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

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

} // end function

function POSTHandler(request, response, data) {
  console.log("Menu posthandler entered");
  var db = require("./DBManager.js").getPool();
  var orderPromise = processOrder(data);

  orderPromise.then(function(ordered) {
    if(ordered) {
      // console.log("Menu items ordered!");
      // response.writeHead(301,
      //   {Location: 'http://localhost:8124/reviewOrder'}
      // );
      // response.end();
      response.writeHead(200);
      response.end();
    } else {
      // response.writeHead(200, {'Content-Type': 'text/html'});
      // response.write('<html><body>Something went wrong while ordering!</body></html>')
      // response.end();
      response.writeHead(501);
      response.end();
    }

  }, function(err) {
    console.log("Error on orderPromise: "+err);

  }); // end orderPromise
} // end function


/*************************** PRIVATE FUNCTIONS ***************************/

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

    // db.all("SELECT * FROM orderedItems WHERE username='temporaryUser'",
    //   function(err, rows) {
    //     if(err) {
    //       console.log("Error is: "+err);
    //     } else if (rows.length > 0) {
    //         rows.forEach(function(row) {
    //           Object.keys(row).forEach(function(key, index) {
    //             console.log(index+"--"+key+": "+row[key]);
    //           });
    //         });
    //     };
    //   }
    // );

    // db.each("SELECT COUNT(username) FROM orderedItems", function(err, rows) {
    //   Object.keys(rows).forEach(function(key, index) {
    //     console.log("\nCount is: "+rows[key]+"\n");
    //   })
    // });
  });
} // end processOrder
