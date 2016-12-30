var casual = require('casual');

module.exports = function() {
	var data = { users: [] }
	for(var i = 1; i < 1000; i++){
		var username = casual.username;
		var first_name = casual.first_name;
		var last_name = casual.last_name;
		var phone = casual.phone;
		var email = casual.email;
		data.users.push({ id: i, username: username, first_name: first_name, last_name: last_name, phone: phone, email: email })
	}
	return data;
}