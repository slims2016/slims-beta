/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'new': function (req, res) {

		res.view();
		
	},
	
	'ngAddUser': function (req, res) {
		// console.log(req.params.all());
		// User.create(req.params.all()).exec(function (err, user) {
		// 	if (err) {
		// 		console.log(err);
		// 		console.log(err.details);
		// 		res.status(err.status);
		// 		res.json(err.details);
		// 	}
		// 	else {
		// 		res.status(201);
		// 		res.json(user);
		// 		console.log('ngAddUser');
		// 		console.log(user);
		// 	}
		// });
		User.create(req.params.all())
		.then(function(user) {
			console.log(user);
			res.status(201);
			res.json(user);
		});
	},

	'ngGetUser': function (req, res) {
		// console.log('req.body');
		// console.log(req.body);
		// console.log('req.params.all()');
		// console.log(req.params.all());
		User.findOne(req.param('id'))
		.populate('roles')
		.exec(function (err, user) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!user) {
				res.status(404);
				res.json('User doesn\'t exist.');
			}
			else {
				// console.log('ngGetUser');
				// console.log(user);
				res.status(200);
				res.json(user);
			}
		});
	},

	'ngGetUserList': function (req, res) {

		// var filter = { username: "admin" };
		// var filter = { username: { startsWith: 'a' } };

		var query = {};
		if (req.param("filter")) {
			// query.where = { username: { 'startsWith': 'a' }, email: { startsWith: 'a' } }; //req.param("filter");
			query.where = JSON.parse(req.param("filter"));
		}
		if (req.param("limit")) {
			query.limit = req.param('limit');	
		}
		if (req.param("page")) {
			query.skip = query.limit * (req.param("page") - 1);	
		}
		if (req.param("order") && req.param("order").length > 0) {
			/*
			ASC: username
			DESC: -username
			*/
			if (req.param("order").charAt(0) == "-") {
				query.sort = req.param("order").substr(1) + " DESC";
			}
			else
			{
				query.sort = req.param("order");
			}
		}
		else
		{
			query.sort = "id"; //default order
		}

		// console.log("query");
		// console.log(query);

		User.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				User.find(query)
				.exec(function (err, users) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						cleanUsers = [];
						// console.log(users.length);
						users.forEach(function(user) {
							cleanUsers.push(user.toJSON());
						});
						// console.log('cleanUsers');
						// console.log(cleanUsers);
						res.status(200);
						// console.log('return value');
						// console.log({total: total, users: cleanUsers});
						res.json({total: total, users: cleanUsers});
					}
				});
			}
		});
	},

	'ngUpdateUser': function(req, res) {

		var userObj = {
			username: req.param('username'),
			fullname: req.param('fullname'),
			email: req.param('email'),
			roles: req.param('roles')
		};

		User.update(req.param('id'), userObj, function(err){
			if (err) {
				console.log('update error');
				console.log(err);
				res.status(err.status);
				res.json(err);
			}
			else {
				res.status(200);
				res.json({"id":req.param('id')});
			}
		});

	},

	'ngUpdatePassword': function(req, res) {

		// console.log(req.params.all());

		var _checkUser = function(err, user) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			if (!user) {
				res.status(401);
				res.json('User doesn\'t exist.');
			}
			else {
				_checkPassword(user);
			}
		};

		var _checkPassword = function(user) {
			var bcrypt = require('bcrypt-nodejs');
			bcrypt.compare(req.param('password'), user.password, function(err, valid) {
				if (err) {
					res.status(err.status);
					res.json(err.details);
				}
				if (valid) {
					var userObj = {
						id: req.param('id'),
						newpassword: req.param('newpassword'),
						confirmation: req.param('confirmation')
					};
					_updateUser(userObj);
				}
				else
				{
					res.status(403);
					res.json('User unauthorized.');	
				}
			});
		};

		var _updateUser = function(user) {
			// console.log('_updateUser');
			// console.log(user);
			User.update(user.id, user, function(err){
				if (err) {
					res.status(err.status);
					res.json(err.details);
				}
				else {
					res.status(200);
					res.json({"id":user.id});
				}
			});
		};

		if (req.param('newpassword')) {
			User.findOne(req.param('id'), _checkUser);
		}
		else
		{
			res.status(403);
			res.json('Password can\'t be blank.');
		}

	},

	'ngDeleteUser': function(req, res) {

		User.findOne(req.param('id'), function (err, user) {
		  if (err) return next(err);

		  if (!user) return next('User doesn\'t exist.');

		  User.destroy(req.param('id'), function (err) {
		    if (err) return next(err);
		  });

		  res.redirect('/user');
    	});
  	},

	'create': function (req, res, next) {
		console.log(req.params.all());
		if (!req.param('_csrf')) {
			// req.session.flash = {
			// 	err: {'Message':'Wrong Method'}
			// };
			// return res.redirect('/user/new');
		}
		User.create(req.params.all(), function (err, user) {
			if (err) {
				//console.log(err);
				req.session.flash = {
					err: err
				};
				return res.redirect('/user/new');
			}

			//Set session expires time: 15 min(s)
			// var oldDate = new Date();
			// var newDate = new Date(oldDate.getTime() + 15 * 60 * 1000); 
			// req.session.cookie.expires = newDate;
			
			// Log user in
			// req.session.authenticated = true;
			// req.session.user = user;

			//res.json(user);
			res.redirect('/user/show/'+user.id);
		});
	},

	'show': function (req, res, next) {
		User.findOne(req.param('id'))
		.populate('roles')
		.exec(function (err, user) {
			if (err) return next(err);
			if (!user) return next();
			// console.log(user.toJSON());
			res.view({
				user: user.toJSON()
			});
		});
	},

	'index': function(req, res, next) {

		// console.log(req.session);

		User.find(function (err, users){
			if (err) return next(err);
			// console.log(users);
			var cleanUsers = [];
	        _.forEach(users, function(user) {
	            cleanUsers.push(user.toJSON());
	        });

	        if (req.param('json') == 'true') {
	        	res.json(cleanUsers);
	        }
	        else {
	        	res.view({
					users: cleanUsers
				});
	        }
			
		});
	},

	'edit': function(req, res, next) {
		User.findOne(req.param('id'))
		.populate('roles')
		.exec(function (err, user) {
			Role.find(function (err, roles) {
				res.view({
					user: user.toJSON(),
					roles: roles
				});	
			});
		});
	},

	'update': function(req, res, next) {
		var userObj = {};
		// console.log(req.params.all());
		if (req.session.user.admin) {
			console.log('Has Admin Param');
		}
		else {
			userObj = {
				username: req.param('username'),
				fullname: req.param('fullname'),
				email: req.param('email'),
				roles: []
			};
		}	

		if (req.param('role_id')) {
			userObj.roles = req.param('role_id');
		}

		User.update(req.param('id'), userObj, function(err){
			if (err) {
				console.log(err);
				return res.redirect('/user/edit/' + req.param('id'));
			}
			
			res.redirect('/user/show/' + req.param('id'));
		});
	},

	'destroy': function(req, res, next) {

		User.findOne(req.param('id'), function (err, user) {
		  if (err) return next(err);

		  if (!user) return next('User doesn\'t exist.');

		  User.destroy(req.param('id'), function (err) {
		    if (err) return next(err);
		  });

		  res.redirect('/user');
    	});
  	}
  	
};
