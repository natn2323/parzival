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
    printUsers(response);

  } // end else if
} // end function

function POSTHandler(request, response, data) {
  createNewUserHandler(request, response, data);
} // end function


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/
function printUsers(response) {
  let db = require('./DBManager.js').getPool();

  db.each("SELECT * FROM loginInfo", function(err, row) {
    console.log(row.createdAt+":: "+row.username+": "+row.password);
  });
  response.end();
}

function createNewUserHandler(request, response, data) {
  let username = data.username,
      password = data.password,
      precheck = "pre",
      postcheck = "post",
      map = new Map();

  checkUserExists(username, precheck)
    .catch(function(err) {
      console.log("Error is thrown when checking user: "+err);
      // return Promise.reject("Error is thrown when checking user: "+err);
      // throw new Error("This should be printed!");
    })
    .then(function(result) {
      console.log("What the hell is the result: "+result);
    })
    .catch(function(err) {
      console.log("But this is: "+err);
      response.writeHead(301,
        {Location: 'http://localhost:8124/newUser'}
      );
      response.end();
    })
    // .then(createNewUser(username, password))
    // .then(checkUserExists(username, postcheck))
    // .then(function() {
    //   response.writeHead(301,
    //     {Location: 'http://localhost:8124/login'}
    //   );
    //   response.end();
    //
    // })
    // .catch(function(err) {
    //   response.writeHead(301,
    //     {Location: 'http://localhost:8124/newUser'}
    //   );
    //   response.end();
    //   console.log("Error is thrown in the process of creating a new user: "+err);
    // });

  // let username = data.username,
  //     password = data.password,
  //     precheck = "pre",
  //     postcheck = "post",
  //     map = new Map();
  //
  // map.set([username, precheck], checkUserExists(username, precheck));
  // map.set([username, password], createNewUser(username, password));
  // map.set([username, postcheck], checkUserExists(username, postcheck));
  //
  // Promise.all(map.values()).then(function(result) {
  //   response.writeHead(301,
  //     {Location: 'http://localhost:8124/login'}
  //   );
  //   response.end();
  //   return true; // successfully created new user
  //
  // }).catch(function(err) {
  //   response.writeHead(301,
  //     {Location: 'http://localhost:8124/newUser'}
  //   );
  //   response.end();
  //   console.log("Error is thrown trying to create new user: "+err);
  //
  //   return false;
  //
  // }).then(function(result) {
  //
  // }); // end promise

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
