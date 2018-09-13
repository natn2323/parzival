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

    let csvPromise = getCSV();
    csvPromise.then(function(result) {
      pool = db.serialize(function() {
        db.run('CREATE TABLE loginInfo ('
                + 'authenticationToken VARCHAR(255),' // This is the cookie
                + 'expiredTokens VARCHAR(255),'
                + 'createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,'
                + 'username VARCHAR(255),'
                + 'password VARCHAR(255),'
                + 'activeOrders VARCHAR(255),'
                + 'pastOrders VARCHAR(255)'
                + ');')
          .run('CREATE TABLE menuItems ('
                + 'itemId INTEGER,'
                + 'itemName VARCHAR(255),'
                + 'itemDescription VARCHAR(255),'
                + 'unitPrice REAL'
                + ');')
          .run('CREATE TABLE reviewItems ('
                + 'itemId INTEGER,'
                + 'quantity INTEGER,'
                + 'username VARCHAR(255)'
                + ');')
          .run('CREATE TABLE orderedItems ('
                + 'itemId INTEGER,'
                + 'itemName VARCHAR(255),'
                + 'unitPrice REAL,'
                + 'quantity INTEGER,'
                + 'totalPricePerItem REAL,'
                + 'username VARCHAR(255),'
                + 'orderId INTEGER,'
                + 'timeOrdered DATETIME DEFAULT CURRENT_TIMESTAMP'
                + ');')
          .run('CREATE TABLE orders ('
                + 'orderId INTEGER,'
                + 'totalPriceOfOrder REAL,'
                + 'statusNew DATETIME,'
                + 'statusFulfilled DATETIME,'
                + 'statusCancelled DATETIME'
                + ');');


        db.run("INSERT INTO loginInfo (username, password) VALUES"
          + " ('admin', 'pass')")
          .run("INSERT INTO loginInfo (username, password) VALUES"
          + " ('admin2', 'pass2')");

        // Insert items from CSV into menuItems table
        for(let i = 0; i < result.length; i++) {
          let unit = result[i];
          db.run("INSERT INTO menuItems"
            + " (itemId, itemName, itemDescription, unitPrice) VALUES"
            + " ($itemId, $itemName, $itemDescription, $unitPrice)",
          {
            $itemId: unit.itemId,
            $itemName: unit.itemName,
            $itemDescription: unit.itemDescription,
            $unitPrice: unit.unitPrice
          });
        } // end for

      });
    })

    return pool;

  }, // end getPool
  getCurrentUsernameAndPassword: function() {
    let current_username = 'temporaryUser'; // TODO: This is temporary!
    return [current_username, current_password];
  }
} // end exports


/*************************************************************************
 *************************** PRIVATE FUNCTIONS ***************************
 *************************************************************************/

function getCSV() {
  let menuFileLocation = './public/data/menuItems.tsv';

  return new Promise(function(resolve, reject) {
    require('fs').readFile(menuFileLocation, "utf8", function(err, data) {
      if (err) {
        reject(err);
      } else {
        let lines = data.split('\n'),
            columns = [],
            item = {},
            menuItems = [];

        for(let i = 0; i < lines.length - 1; i++) {
          // Skip the row of column headers
          if(i === 0) continue;

          let line = lines[i],
              columns = line.split('  ');

          let itemId = columns[0],
              itemName = columns[1],
              itemDescription = columns[2],
              unitPrice = columns[3];

          menuItems.push({
            "itemId": itemId,
            "itemName": itemName,
            "itemDescription": itemDescription,
            "unitPrice": unitPrice
          });

        } // end for
        resolve(menuItems);

      } // end else
    }); // end readFile
  }); // return promise
} // end getCSV
