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
  init: function() {
    if(pool) return pool; // Singleton
    pool = db.serialize(function() {
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
              + 'quantity varchar(255),'
              + 'unitPrice varchar(255),'
              + 'totalPerItem varchar(255),'
              + 'totalOrder varchar(255),'
              + 'username varchar(255),'
              + 'timeOrdered DATETIME DEFAULT CURRENT_TIMESTAMP'
              + ');'
      );
      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin', 'pass')");
      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin2', 'pass2')");
    });

    return pool;
  },
  /* Quick validation of given info, then checking against database.
     Some validattion COULD be done from the browser as well, as to avoid
     making extraneous validations */
  validateLogin: function(data) {
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
    return new Promise(function(resolve, reject) {

      for(let i = 0; i < data['content'].length; i++) {
        let unit = data['content'][i];

        db.run("INSERT INTO orderedItems "
          + "(itemName, quantity, unitPrice, username) VALUES"
          + "($itemName, $quantity, $unitPrice, $username)",
          {
            $itemName: unit.item,
            $quantity: unit.quantity,
            $unitPrice: unit.price,
            $username: 'temporaryUser'
          },
          function(err) {
            if(!err) {
              // Could do some counting--if only I could get it to work
            } else {
              reject(err);
            }
          }
        ); // end run

      } // end for
      resolve(true);

      // db.all("SELECT * FROM orderedItems WHERE username='temporaryUser'",
      //   function(err, rows) {
      //     if(err) {
      //       console.log("Error is: "+err);
      //     } else if (rows.length > 0) {
      //         rows.forEach(function(row) {
      //           Object.keys(row).forEach(function(key, index) {
      //             console.log(index+"--"+key+": "+row[key]);
      //           });
      //         });
      //     };
      //   }
      // );

      // db.each("SELECT COUNT(username) FROM orderedItems", function(err, rows) {
      //   Object.keys(rows).forEach(function(key, index) {
      //     console.log("\nCount is: "+rows[key]+"\n");
      //   })
      // });
    });
  },
  getCurrentUsernameAndPassword: function() {
    return [current_username, current_password];
  }

} // end exports

// Private functions
function validateLoginWithDatabase(givenUsername, givenPassword) {
  return new Promise(function(resolve, reject) {

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
    }); // end query
  }); // end return
} // end function
// Currently only checking for existence of username and password
