'use strict';

module.exports = {
  createAuthentication: function(username) {
    return new Promise(function(resolve, reject) {
      var db = require('./DBManager.js').getPool();
      let cookie = generateCookie("time");

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
      db.all("SELECT username, authenticationToken"
        + " FROM loginInfo"
        + " WHERE authenticationToken = $cookie;",
        {
          $cookie: cookie
        },
        function(err, rows) {
          if(err) {
            reject(err);
          } else if (rows.length===1) {
            let username = rows[0]['username'],
                cookie = rows[0]['authenticationToken'];
            console.log("Got a result! Verify!");
            console.log(`U: ${username}, C: ${cookie}`);
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

function generateCookie(criteria) {
  let uuid = require('uuid');

  if(criteria)
    if(criteria === "time") return uuid.v1();
  else return uuid.v4();
} // end generateCookie
