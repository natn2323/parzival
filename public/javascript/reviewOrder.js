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
  if(request.url === "/reviewOrder") {

    // Handling the inline GET request
    if(request.headers['x-requested-with'] &&
        request.headers['x-requested-with'] === 'XMLHttpRequest') {

      // GET-ing the page involves orders based on menu page selections
      var username = require('./DBManager.js').getCurrentUsernameAndPassword()[0];

      var reviewPromise = getItemOrder(username); // username is being hardcoded
      reviewPromise.then(function(rows) {
        // Parsing data
        let dataToSubmit = {'content': []}
        for(let i = 0; i < rows.length; i++) {
          let unit = rows[i];
          dataToSubmit['content'].push({
            'item': unit.itemName,
            'quantity': unit.quantity
          });
        } // end for

        response.writeHead('200', {'Content-Type': 'application/json'});
        response.end(JSON.stringify(dataToSubmit));

      }, function(err) {
        console.log("Error on reviewPromise: "+err);
    });

    } else {
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

    } // end else
  } // end outer if
} // end GETHandler

function POSTHandler(request, response, data) {
  console.log("reviewOrder POSTHandler entered!");
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

function getItemOrder(username) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.all('SELECT * FROM orderedItems WHERE username=$username', {
        $username: username
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
    ) // end query
  }); // end return

} // end getItemOrder
