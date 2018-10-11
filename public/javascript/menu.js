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

  let path_arr = require('./utils.js').getSubPath(request);
  if (path_arr.length === 1 && path_arr[0] === "menu") {
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
  } else if (path_arr.length > 1
    && path_arr[0] === "menu"
    && path_arr[1] === "items") {
      console.log("This is entered!");
      getMenuItemsHandler(request, response);

    } // end else if
} // end GETHandler

function POSTHandler(request, response, data) {
  console.log("Menu posthandler entered");

  let path_arr = require('./utils.js').getSubPath(request);
  if (path_arr.length === 2
    && path_arr[0] === "menu"
    && path_arr[1] === "order") {
    console.log("Menu click handler entered!");
    processOrderHandler(request, response, data);

  } // end submit handler
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

 function getMenuItemsHandler(request, response) {
   let orderPromise = getMenuItems();
   orderPromise.then(function(rows) {
     if(rows) {
       console.log("Menu items retrieved!");
       // Parsing data
       let dataToSubmit = {'content': []};
       for(let i = 0; i < rows.length; i++) {
         let unit = rows[i];
         dataToSubmit['content'].push({
           'itemId': unit.itemId,
           'itemName': unit.itemName,
           'itemDescription': unit.itemDescription,
           'unitPrice': unit.unitPrice
         }); // end push
       } // end for

       response.writeHead('200', {'Content-Type': 'application/json'});
       response.end(JSON.stringify(dataToSubmit));

     } // end if
   }) // end promise
 } // end getMenuItemsHandler

 function getMenuItems() {
   return new Promise(function(resolve, reject) {
     let db = require('./DBManager.js').getPool();

     db.all('SELECT * FROM menuItems',
       function(err, rows) {
         if(err) {
           reject(err);

         } else if (rows.length>0) {
           resolve(rows);

         } else if (rows.length===0) {
           resolve(false);

         }
     }); // end query
   }); // end return
 } // end getMenuItems

function processOrderHandler(request, response, data) {
  let cookie = "";
  if(request.headers && request.headers['cookie']) {
    cookie = request.headers['cookie'];
  }

  // TODO: Handle no cookie case? Or it's already handled at the dispatcher.js level
  var orderPromise = processOrder(cookie, data); 
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

function processOrder(cookie, data) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    for(let i = 0; i < data['content'].length; i++) {
      let unit = data['content'][i];

      // backend validation
      if(parseInt(unit.quantity) <= 0
        || parseInt(unit.itemiD) <= 0) {
          continue;
      } else {
        db.run("INSERT INTO reviewItems "
          + "(itemId, quantity, cookie) VALUES"
          + "($itemId, $quantity, $cookie)",
          {
            $itemId: unit.itemId,
            $quantity: unit.quantity,
            $cookie: cookie
          },
          function(err) {
            if(!err) {
              // Could do some counting--if only I could get it to work
            } else {
              reject(err);
            }
          } // end callback
        ); // end run
      } // end else

    } // end for
    resolve(true);

  }); // end return
} // end processOrder
