'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("newuser.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}

/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function GETHandler(request, response) {
  console.log("Newuser gethandler entered");

  let path_arr = require('./utils.js').getSubPath(request);
  if(path_arr.length === 1 && path_arr[0] === "newUser") {
    var fs = require('fs');
      fs.readFile('./public/html/newUser.html', function(err, data) {
      if(err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      }
    });

  } else if (path_arr.length > 1
    && path_arr[0] === "newUser"
    && path_arr[1] === "check") {
    getAllUsersHandler(request, response);

  } else if (path_arr.length > 1
    && path_arr[0] === "newUser"
    && path_arr[1] === "orders") {
    getAllOrderedItemsHandler(request, response);
  } // end else if
} // end function

function POSTHandler(request, response, data) {
  createNewUserHandler(request, response, data);
} // end function


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

function getAllUsersHandler(requeust, response) {
  let printUsersPromise = getAllUsers();
  printUsersPromise.then(function(rows) {
    if(rows) {
      console.log("User logins retrieved!");
      // Parsing data
      let dataToSubmit = {'content': []};
      for(let i = 0; i < rows.length; i++) {
        let unit = rows[i];
        dataToSubmit['content'].push({
          'createdAt': unit.createdAt,
          'username': unit.username,
          'password': unit.password,
          'authenticationToken': unit.authenticationToken
        }); // end push
      } // end for

      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(dataToSubmit));

    } // end if
  }); // end promise
} // end getAllUsersHandler

function getAllUsers() {
  return new Promise(function(resolve, reject) {
    let db = require('./DBManager.js').getPool();

    db.all("SELECT * FROM loginInfo",
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
} // end getAllUsers

function getAllOrderedItemsHandler(request, response) {
  let printOrdersPromise = getAllOrderedItems();
  printOrdersPromise.then(function(rows) {
    if(rows) {
      console.log("All orders retrieved!");
      // Parsing data
      let dataToSubmit = {'content': []};
      for(let i = 0; i < rows.length; i++) {
        let unit = rows[i];
        dataToSubmit['content'].push({
          'itemId': unit.itemId,
          'itemName': unit.itemName,
          'unitPrice': unit.unitPrice,
          'quantity': unit.quantity,
          'totalPricePerItem': unit.totalPricePerItem,
          'cookie': unit.cookie,
          'orderId': unit.orderId,
          'timeOrdered': unit.timeOrdered
        }); // end push
      } // end for

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(dataToSubmit));

    } // end if
  }); // end promise
} // end getAllOrderedItemsHandler

function getAllOrderedItems() {
  return new Promise(function(resolve, reject) {
      let db = require('./DBManager.js').getPool();

      db.all("SELECT * FROM orderedItems",
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
} // end getAllOrderedItems

function createNewUserHandler(request, response, data) {
  let username = data.username,
      password = data.password,
      precheck = "pre",
      postcheck = "post",
      config = require('../../config.json');

  /* Check that the login doesn't exist, create it, verify, then redirect */
  checkUserExists(username, precheck)
    .then(() => createNewUser(username, password))
    .then(() => checkUserExists(username, postcheck))
    .then(() => {
      response.writeHead(301,
        {Location: config.protocol+'://'+config.hostname+':'+config.server_port+'/login'}
      );
      response.end();
    })
    /* If the user existed, SQLite threw an error, or the user wasn't created,
       then output the error and redisplay the newUser page*/
    .catch(err => {
      console.log("Caught error: "+err);
      response.writeHead(301,
        {Location: config.protocol+'://'+config.hostname+':'+config.server_port+'/newUser'}
      );
      response.end();
    }); // end promise chain

} // end createNewUserHandler

function checkUserExists(username, check) {
  // return Promise.resolve("What is going on");
  return new Promise(function(resolve, reject) {
    let db = require('./DBManager.js').getPool();

    db.all('SELECT * FROM loginInfo WHERE username=$username',
      {
        $username: username
      },
      function(err, rows) {
        if(err) {
          reject("SQLite3 error: "+err);
        }

        if(rows.length===0) {
          if(check==="pre") {
            resolve();
          } else if(check === "post") {
            reject(`Username "${username}" was not created!`);
          }

        } else if(rows.length===1 && check==="pre") {
            reject(`Username "${username}" already exists!`);

        } else if(rows.length===1 && check==="post") {
            resolve();
        }
      } // end callback
    ); // end query
  }); // end return
} // end createNewUser

function createNewUser(username, password) {
  return new Promise(function(resolve, reject) {
    let db = require('./DBManager.js').getPool();

    db.run("INSERT INTO loginInfo (username, password) VALUES"
      + "($username, $password)",
      {
        $username: username,
        $password: password
      },
      function(err) {
        if(err) {
          reject("SQLite3 error: "+err);
        } else {
          resolve("User created!");
        }
      }
    ); // end query
  }); // end return
} // end createNewUser
