/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
  	schema: true,
  	tableName: 'master_user',
  	attributes: {

	 	username: {
	 		type: 'string',
	 		required: true,
	 		unique: true,
	 		columnName: 'UserName'
	 	},

	 	fullname: {
	 		type: 'string',
	 		columnName: 'FullName'
	 	},

	 	email: {
	 		type: 'string',
	 		required: true,
	 		email: true,
	 		unique: true,
	 		columnName: 'Email'
	 	},
	 	
	 	password: {
	 		type: 'string',
	 		columnName: 'Password'
	 	},

	 	online: {
			type: 'boolean',
			defaultsTo: false
	    },

	    roles: {
	    	collection: 'role',
	    	via: 'users',
	    	dominant: true
	    },

	 	toJSON: function() {
	 		var obj = this.toObject();
	 		delete obj.password;
	 		delete obj._csrf;
	 		return obj;
	 	}

  	},

	beforeCreate: function (user, next) {
		// This checks to make sure the password and password confirmation match before creating record
		if (!user.password || user.password != user.confirmation) {
		  return next({err: ["Password doesn't match password confirmation."]});
		}

		var bcrypt = require('bcrypt-nodejs');
		//hash(data, salt, progress, callback(err, result))
		bcrypt.hash(user.password, null, null, function(err, encrypted) {
			user.password = encrypted;
			// console.log('Encrypted: ' + user.password);
			next();
		});
	},

	beforeUpdate: function (user, next) {
		if (user.newpassword) {
			if (user.newpassword == user.confirmation) {
				var bcrypt = require('bcrypt-nodejs');
				bcrypt.hash(user.newpassword, null, null, function(err, encrypted) {
					if (err) {
						return next(err);
					}
					user.password = encrypted;
					delete user.newpassword;
					delete user.confirmation;
					next();
				});
			}
			else {
				return next({err: ["Password doesn't match password confirmation."]});
			}
		}
		else {
			next();
		}
	}

};

