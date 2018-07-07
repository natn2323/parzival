'use strict';

module.exports = {
	validate: function(data) {
		if(typeof data != "undefined") {
			if(data['username'] != 'undefined' && data['password'] != 'undefined') {
				let username = data['username'],
						password = data['password'];
				validateLoginWithDatabase(username, password);
			}
		} else { // Fail to authenticate
			return
		}
	}
}

function validateLoginWithDatabase(givenUsername, givenPassword) {
	try{
		var stmt = db.all("SELECT username, password FROM loginInfo WHERE username=$username AND password=$password", {
				$username: givenUsername,
				$password: givenPassword
			},
			function(err, rows){ // Working on the callback function to get results
				if(err) {
					throw err;
				} else if (rows.length>0) {
					console.log("Accessed!");
					console.log(rows[0]['username']);
					console.log(rows[0]['password']);
				} else if(rows.length === 0) {
					console.log("No result!\n"
						+ "Ergo, username and password don't check out!\n"
						+ "Bad u: %s, p: %s\n", givenUsername, givenPassword);
				}
			});
	} catch(error) {
		console.log("MySQL error. Error Message: "+error);
	}

}
