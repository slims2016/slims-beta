/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'ngLoginUser': function (req, res) {
		
		if (req.method != "PUT") {
			res.status(403);
			res.json('Wrong login method: ' + req.method + '.');	
			return;
		}

		if (!req.param('username') || !req.param('password')) {
			res.status(403);
			res.json('User or password is not provided.');	
			return;
		}
		
		// User.findOneByUsername(req.param('username'))
		User.findOne()
		.where({username:req.param('username')})
		.exec(function (err, user) {
			if (err) {
				res.status(err.status);
				res.json(err.details);		
			}
			else if (!user) {
				res.status(403);
				res.json('User doesn\'t exist.');
			}
			else {
				var bcrypt = require('bcrypt-nodejs');
				bcrypt.compare(req.param('password'), user.password, function(err, valid) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					if (valid) {
						// Set session expires time: 15 min(s)
						var oldDate = new Date();
						var newDate = new Date(oldDate.getTime() + 15 * 60 * 1000); 
						req.session.cookie.expires = newDate;
						// Log user in
						req.session.authenticated = true;
						req.session.user = user.toJSON();
						// Return ok
						res.status(200);
						res.json(user.toJSON());
					}
					else
					{
						res.status(403);
						res.json('Password invalid.');	
					}
				});
			}
			
		})
	},

	'ngLogoutUser': function (req, res) {
		
		req.session.destroy();
		res.status(202);
		res.json('User Logout.');

	},

	/*
	Session {
	  cookie:
	   { path: '/',
	     _expires: Thu Sep 01 2016 17:23:25 GMT+0800 (中国标准时间),
	     originalMaxAge: 899999,
	     httpOnly: true },
	  csrfSecret: 'nS1TUBBPrMVQSnfx02U15R3H',
	  authenticated: true,
	  user:
	   { online: true,
	     id: 1,
	     createdAt: '2016-07-15T13:57:36.000Z',
	     updatedAt: '2016-09-01T09:03:50.000Z',
	     username: 'admin',
	     fullname: 'Sys Admin1',
	     email: 'sys@admin.com' } }
	*/

	'ngGetSession': function (req, res) {
		if (req.method != "PUT") {
			res.status(403);
			res.json('Wrong session method: ' + req.method + '.');	
			return;
		}
		if (!req.param('Session') || req.param('Session') != 'ngGetSession') {
			res.status(403);
			res.json('Wrong session params.');	
			return;
		}
		var date = new Date();
		// console.log('ngGetSession: ' + date);
		res.status(200);
		res.json(req.session);
	},
	
};

