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
  verifyAuthentication: function(username, cookie) {
    return new Promise(function(reject, resolve) {
      var db = require('./DBManager.js').getPool();
      db.all("SELECT authenticationToken "
        + "FROM loginInfo "
        + "WHERE username=$username"
        + "AND authenticationToken=$cookie",
        {
          $username: username,
          $cookie: cookie
        },
        function(err, rows) {
          if(err) {
            reject(err);
          } else if (rows.length===1) {
            console.log("Got a result! Verify!");
            resolve(true);
          } else if (rows.length===0) {
            console.log("No result!");
            reject(false);
          } else if (rows.length>0) {
            console.log("Multiple entries of a username and cookie!");
            reject(false);
          }
        } // end callback
      ); // end run
    }); // end return
  } // end verifyAuthentication

} // end exports

function createCookie() {
  return true;
} // end createCookie
