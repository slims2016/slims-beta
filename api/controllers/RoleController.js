/**
 * RoleController
 *
 * @description :: Server-side logic for managing roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function (req, res) {

		res.view();
	},

	'ngAddRole': function (req, res) {
		Role.create(req.params.all())
		.then(function(role) {
			console.log(role);
			res.status(201);
			res.json(role);
		});
	},

	'ngGetRole': function (req, res) {
		Role.findOne(req.param('id'), function (err, role) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!role) {
				res.status(404);
				res.json('Role doesn\'t exist.');
			}
			else {
				res.status(200);
				res.json(role);
			}
		});
	},

	'ngGetRoles': function (req, res) {

		Role.find(function (err, roles) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				res.status(200);
				res.json(roles);
			}
		});

	},

	'ngGetRoleList': function (req, res) {

		var query = {};
		if (req.param("filter")) {
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

		Role.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Role.find(query)
				.exec(function (err, roles) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, roles: roles});
					}
				});
			}
		});
	},

	'ngUpdateRole': function(req, res) {
		var roleObj = {
			name: req.param('name'),
			remark: req.param('remark')
		};
		Role.update(req.param('id'), roleObj, function(err){
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

	'create': function (req, res, next) {

		Role.create(req.params.all(), function (err, role) {
			if (err) {

				req.sesson.flash = {
					err: err
				};
				return res.redirect('/role/new');
			}

			res.redirect('/role/show/'+role.id);
		});
	},

	'show': function (req, res, next) {
		
		Role.findOne(req.param('id'), function (err, role) {
			if (err) return next(err);
			if (!role) return next();
			res.view({
				role: role
			});
		});
	},

	'index': function (req, res, next) {

		Role.find(function (err, roles) {
			if (err) return next(err);

			res.view({
				roles: roles
			});
		});
	},

	'edit': function(req, res, next) {
		Role.findOne(req.param('id'), function (err, role){
			if (err) return next(err);
			if (!role) return next();
			
			res.view({
				role: role.toJSON()
			});
		});
	},

	'update': function (req, res, next) {
		var roleObj = {
			name: req.param('name'),
			remark: req.param('remark')
		};

		Role.update(req.param('id'), roleObj, function(err) {
			if (err) {
				return res.redirect('/role/edit/' + req.param('id'));
			}

			res.redirect('/role/show/' + req.param('id'));
		});

	},

	'destroy': function (req, res, next) {

		Role.findOne(req.param('id'), function(err, role) {
			if (err) return next(err);

			if (!role) return next('Role doesn\'t exist.');

			Role.destroy(req.param('id'), function (err) {
			    if (err) return next(err);
			  });        

			res.redirect('/role');
		})
	}
	
};

