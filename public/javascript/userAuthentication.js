'use strict';

module.exports = {
  createAuthentication: function(username) {
    return new Promise(function(resolve, reject) {
      var db = require('./DBManager.js').getPool();
      let cookie = "SomeDefaultCookie"; // TODO: create a function to do this

      db.run("UPDATE loginInfo"
        + " SET authenticationToken = $cookie"
        + " WHERE username = $username;",
        {
          $cookie: cookie,
          $username: username
        },
        function(err) {
          if(err) {
            reject(err);

          } else {
            resolve(cookie);

          }
        } // end callback
      ); // end run
    }); // end return
  }, // end createAuthentication
  authenticateCookie: function(cookie) {
    return new Promise(function(resolve, reject) {
      var db = require('./DBManager.js').getPool();
      db.all("SELECT username"
        + " FROM loginInfo"
        + " WHERE authenticationToken = $cookie;",
        {
          $cookie: cookie
        },
        function(err, rows) {
          if(err) {
            reject(err);
          } else if (rows.length===1) {
            console.log("Got a result! Verify!");
            console.log("Cookie row is: "+rows[0]['authenticationToken']);
            resolve();
          } else if (rows.length===0) {
            console.log("No result!");
            reject("No result!");
          } else if (rows.length>0) {
            console.log("Multiple entries of a cookie! Impossible!");
            reject("Multiple entries of a cookie! Impossible!");
          }
        } // end callback
      ); // end run
    }); // end return
  } // end authenticateCookie
} // end exports

function cookieCutter() {

} // end cookieCutter
