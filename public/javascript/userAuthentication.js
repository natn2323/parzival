'use strict';

module.exports = {
  createAuthentication: function(username) {
    return new Promise(function(reject, resolve) {
      var db = require('./DBManager.js').getPool();
      let cookie = createCookie();
      db.run("UPDATE loginInfo "
        + "SET cookie=$cookie "
        + "WHERE username=$username",
        {
          $cookie: cookie,
          $username: username
        },
        function(err) {
          if(!err) {
            /* Could do something with chainable Database object, i.e. verify
               by doing a SELECT to see that the change has gone through. */
            resolve(true);
          } else {
            reject(err);
          }
        } // end callback
      ); // end run
    }); // end return
  }, // end createAuthentication
  authenticateUsernameAgainstCookie: function(cookie) {
    return new Promise(function(reject, resolve) {
      var db = require('./DBManager.js').getPool();
      db.all("SELECT username"
        + " FROM loginInfo"
        + " WHERE authenticationToken=$cookie;",
        {
          $cookie: cookie
        },
        function(err, rows) {
          if(err) {
            reject(err);
          } else if (rows.length===1) {
            console.log("Got a result! Verify!");
            console.log("Cookie row is: "+row[0]['authenticationToken']);
            resolve();
          } else if (rows.length===0) {
            console.log("No result!");
            reject();
          } else if (rows.length>0) {
            console.log("Multiple entries of a username and cookie!");
            reject();
          }
        } // end callback
      ); // end run
    }); // end return
  } // end verifyAuthentication

} // end exports

function createCookie() {
  return true;
} // end createCookie
