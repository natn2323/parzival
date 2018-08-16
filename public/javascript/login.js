'use strict';

module.exports = {
  handle: function(request, response, data) {
    console.log("Login.js entered!");
    if(request.method === "GET") GETHandler(request, response);
    else if(request.method === "POST") POSTHandler(request, response, data);
  }
}


/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function GETHandler(request, response) {
  var fs = require('fs');
  fs.readFile('./public/html/login.html', function(err, data) {
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
  validateLogin(data)
    .then(([user, pw]) => validateLoginWithDatabase(user, pw))
    .then(username => createCookie(username))
    .then(cookie => {
      console.log("Validated!");
      response.writeHead(301,
        {
          'Set-Cookie': cookie,
          Location: 'http://localhost:8124/menu'
        }
      );
      response.end();
    })
    .catch(err => {
      console.log("Caught error: "+err);
      response.writeHead(301,
        {Location: 'http://localhost:8124/login'}
      );
      response.end();
    }); // end promise chain
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

/* Username to be passed from validateLogin */
function createCookie(username) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();
    let cookie = "SomeDefaultCookie"; // want to create a function that does this

    db.run("UPDATE loginInfo"
      + " SET authenticationToken = $cookie"
      + " WHERE username = $username",
    {
      $cookie: cookie,
      $username: username
    },
    function(err) {
      if(err) {
        reject();

      } else {
        resolve(cookie);

      } // end else
    }); // end run
  }); // end return
} // end createCookie

/* Quick validation of given info, then checking against database.
   Some validattion COULD be done from the browser as well, as to avoid
   making extraneous validations */
function validateLogin(data) {
  return new Promise(function(resolve, reject) {
    if(typeof data !== "undefined") {
      if(data['username'] !== 'undefined' && data['password'] !== 'undefined') {
        // 'let' has local scope
        let username = data['username'],
            password = data['password'];
        // var validated = validateLoginWithDatabase(username, password);
        console.log("Inside validateLogin: "+username+" and: "+password);
        resolve([username, password]);
      }
    } else { // Fail to authenticate / data is lost(?)
        reject();
    }
  }); // end return
} // end validateLogin


function validateLoginWithDatabase(givenUsername, givenPassword) {
  return new Promise(function(resolve, reject) {
    var db = require('./DBManager.js').getPool();

    db.all("SELECT username, password FROM loginInfo WHERE"
      + " username=$username AND password=$password", {
        $username: givenUsername,
        $password: givenPassword,
      },
      /* This is a callback function. After the above function completes, then
         its data is delivered to this function. In this case, its data is an
         error if an error is produced, or rows if no error is produced */
      function(err, rows){
        if(err) {
          reject(err);

        } else if (rows.length>0) { // Check that the result set is non-empty
          // Do things with non-empty result set -- possibly return True
          console.log("Accessed!");
          console.log(rows[0]['username']);
          console.log(rows[0]['password']);
          resolve(givenUsername, givenPassword);

        } else if(rows.length === 0) { // Dealing with empty result sets
          // Do something when result set empty -- possibly return False
          console.log("No result!\n"
            + "Ergo, username and password don't check out!\n"
            + "Bad u: %s, p: %s\n", givenUsername, givenPassword);
          reject();

        }
    }); // end query
  }); // end return
} // end validateLoginWithDatabase
// Currently only checking for existence of username and password
