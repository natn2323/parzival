'use strict';

/* Initializing database */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var current_username = "";
var current_password = "";
var pool;

/* Code within the module.exports property is public and can be Accessed from
	 other modules */
module.exports = {
  // Initializing database and adding some mock data
  getPool: function() {
    if(pool) return pool; // Singleton
    pool = db.serialize(function() {
      db.run('CREATE TABLE loginInfo ('
              + 'userId varchar(255),'
              + 'username varchar(255),'
              + 'password varchar(255)'
              + ');')
        .run('CREATE TABLE menuItems ('
              + 'itemName varchar(255),'
              + 'price real'
              + ');')
        .run('CREATE TABLE orderedItems ('
              + 'itemName varchar(255),'
              + 'quantity varchar(255),'
              + 'unitPrice varchar(255),'
              + 'totalPerItem varchar(255),'
              + 'totalOrder varchar(255),'
              + 'username varchar(255),'
              + 'timeOrdered DATETIME DEFAULT CURRENT_TIMESTAMP'
              + ');');

      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin', 'pass')")
        .run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin2', 'pass2')");
    });
    return pool;

  }, // end getPool
  getCurrentUsernameAndPassword: function() {
    return [current_username, current_password];
  }
} // end exports
