'use strict;'

/* Initializing database */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
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
      db.run("INSERT INTO loginInfo (userId, username, password) VALUES"
        + " ('123', 'admin', 'pass')");
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
				console.log(validateLoginWithDatabase(username, password));
				//setInterval(function(){console.log('validated (DBManager): '+validated);}, 3000);
				return validateLoginWithDatabase(username, password);
			}
		} else { // Fail to authenticate / data is lost(?)
			  return false;
		}
	}

}

// Private functions
function validateLoginWithDatabase(givenUsername, givenPassword) {
	try{
    // Currently only checking for existence of username and password
		var stmt = db.all("SELECT username, password FROM loginInfo WHERE"
      + " username=$username AND password=$password", {
				$username: givenUsername,
				$password: givenPassword
			},
      /* This is a callback function. After the above function completes, then
         its data is delivered to this function. In this case, its data is an
         error if an error is produced, or rows if no error is produced */
			function(err, rows){
				if(err) {
					throw err;
				} else if (rows.length>0) { // Check that the result set is non-empty
          // Do things with non-empty result set -- possibly return True
					console.log("Accessed!");
					console.log(rows[0]['username']);
					console.log(rows[0]['password']);
					return true;
				} else if(rows.length === 0) { // Dealing with empty result sets
          // Do something when result set empty -- possibly return False
					console.log("No result!\n"
						+ "Ergo, username and password don't check out!\n"
						+ "Bad u: %s, p: %s\n", givenUsername, givenPassword);
					return false;
				}
			});
	} catch(error) {
    // Do something when error -- possibly return False and/or throw error
		console.log("Database error. Error Message: "+error);
	}
}
