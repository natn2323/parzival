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
  var validationPromise = validateLogin(data);
  validationPromise.then(function(validated) {
    if(validated) {
      console.log("Validated!");
      response.writeHead(301,
        {Location: 'http://localhost:8124/menu'}
      );
      /* From documentation, after a "finish" event, no more events will be
        emitted on the response object */
      response.end();

    } else {
      /* Not validated, maybe do some frontend response or send to
         loginError.html or the like */
      response.writeHead(301,
        {Location: 'http://localhost:8124/login'}
      );
      response.end();

    }
  }, function(err) {
    console.log("Error on validationPromise: "+err);

  }); // end validationPromise
} // end POSTHandler


/************************************************************************
 *************************** HELPER FUNCTIONS ***************************
 ************************************************************************/

/* Quick validation of given info, then checking against database.
   Some validattion COULD be done from the browser as well, as to avoid
   making extraneous validations */
function validateLogin(data) {
  if(typeof data !== "undefined") {
    if(data['username'] !== 'undefined' && data['password'] !== 'undefined') {
      // 'let' has local scope
      let username = data['username'],
          password = data['password'];
      var validated = validateLoginWithDatabase(username, password);
      return validated;
    }
  } else { // Fail to authenticate / data is lost(?)
      return false;
  }
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
          resolve(true);

        } else if(rows.length === 0) { // Dealing with empty result sets
          // Do something when result set empty -- possibly return False
          console.log("No result!\n"
            + "Ergo, username and password don't check out!\n"
            + "Bad u: %s, p: %s\n", givenUsername, givenPassword);
          resolve(false);

        }
    }); // end query
  }); // end return
} // end validateLoginWithDatabase
// Currently only checking for existence of username and password
