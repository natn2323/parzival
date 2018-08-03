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
              + 'authenticationToken VARCHAR(255),'
              + 'createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,'
              + 'username VARCHAR(255),'
              + 'password VARCHAR(255)'
              + ');')
        .run('CREATE TABLE menuItems ('
              // + 'itemName VARCHAR(255)'
              + 'itemName VARCHAR(255),'
              + 'itemDescription VARCHAR(255),'
              + 'unitPrice REAL'
              + ');')
        .run('CREATE TABLE orderedItems ('
              + 'itemName VARCHAR(255),'
              + 'unitPrice REAL,'
              + 'quantity INTEGER,'
              + 'totalPricePerItem VARCHAR(255),'
              + 'totalPriceOfOrder VARCHAR(255),'
              + 'username VARCHAR(255),'
              + 'timeOrdered DATETIME DEFAULT CURRENT_TIMESTAMP'
              + ');');

      db.run("INSERT INTO menuItems (itemName, itemDescription, unitPrice) VALUES"
        + " ('Fish Filet', 'Yummy fish in a sandwich.', 9.95)")
        .run("INSERT INTO menuItems (itemName, itemDescription, unitPrice) VALUES"
        + " ('Turkey breast', 'White-meat turket breast, atop of a baguette.', 12.75)");

      db.run("INSERT INTO loginInfo (username, password) VALUES"
        + " ('admin', 'pass')")
        .run("INSERT INTO loginInfo (username, password) VALUES"
        + " ('admin2', 'pass2')");

      db.run("INSERT INTO orderedItems (itemName, quantity, username) VALUES"
        + " ('Chunky Soup', '10', 'temporaryUser')")
        .run("INSERT INTO orderedItems (itemName, quantity, username) VALUES"
          + " ('Soft Sandwich', '2', 'temporaryUser')")
    });
    return pool;

  }, // end getPool
  getCurrentUsernameAndPassword: function() {
    let current_username = 'temporaryUser'; // TODO: This is temporary!
    return [current_username, current_password];
  }
} // end exports
