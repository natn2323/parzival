'use strict;'

/* Initializing database */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var current_username = "";
var current_password = "";
var pool;
db.run('CREATE TABLE loginInfo ('
        + 'userId varchar(255),'
        + 'username varchar(255),'
        + 'password varchar(255)'
        + ');'
      );
db.run('CREATE TABLE menuItems ('
        + 'itemName varchar(255),'
        + 'price real'
        + ');'
      );
db.run('CREATE TABLE orderedItems ('
        + 'itemName varchar(255),'
        + 'price varchar(255),'
        + 'username varchar(255),'
        + 'time_ordered DATETIME DEFAULT CURRENT_TIMESTAMP'
        + ');'
      );

console.log("Table 2 created");

/* Code within the module.exports property is public and can be Accessed from
	 other modules */
module.exports = {
  // Initializing database and adding some mock data
  init: function() {
    if(pool) return pool; // Singleton
    pool = db.serialize(function() {
      
      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin', 'pass')");
      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin2', 'pass2')");
      db.run("INSERT INTO menuItems (itemName, price) VALUES"
        + " ('Bbq Drumsticks', 6.25)");
      db.run("INSERT INTO menuItems (itemName, price) VALUES"
              + " ('French Fries', 4.25)");
      db.run("INSERT INTO menuItems (itemName, price) VALUES"
              + " ('Chick-un Nuggets', 5.95)");
    });
      

    return pool;
  },
  /* Quick validation of given info, then checking against database.
     Some validattion COULD be done from the browser as well, as to avoid
     making extraneous validations */
  validate: function(data) {
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
	},

  processOrder: function(data, username) {
    console.log("Call to back-end DB");
    var price = data.split(" ")[2];
    var item = data.split(" ")[0] + " " + data.split(" ")[1];
    db.run("INSERT INTO orderedItems (itemName, price, username) VALUES"
              + " ('" + item + "', '" + price + "', '" + username + "')");
    db.all("SELECT * FROM orderedItems", function(err, rows) {  
        rows.forEach(function (row) {  
          console.log(row);    // and other columns, if desired
    });
  });
    return "Successful call to back-end";
  },

  getCurrentUsernameAndPassword: function() {
    return [current_username, current_password];
  }

}

// Private functions
function validateLoginWithDatabase(givenUsername, givenPassword) {
  return new Promise(function(resolve, reject) {
    db.all("SELECT * FROM menuItems", function(err, rows) {  
        rows.forEach(function (row) {  
          console.log(row);    // and other columns, if desired
    });
  });

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
        current_username = rows[0]['username'];
        current_password = rows[0]['password'];
        resolve(true);
      } else if(rows.length === 0) { // Dealing with empty result sets
        // Do something when result set empty -- possibly return False
        console.log("No result!\n"
          + "Ergo, username and password don't check out!\n"
          + "Bad u: %s, p: %s\n", givenUsername, givenPassword);
        resolve(false);
      }
    });
  });


  // Currently only checking for existence of username and password

}


