/**
 * EntityController
 *
 * @description :: Server-side logic for managing entities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var entityTypes = [{id:0,name:'Mixed'},{id:1,name:'Customer'},{id:2,name:'Vendor'}];

module.exports = {

	'ngAddEntity': function (req, res) {
		Entity.create(req.params.all())
		.then(function(entity) {
			res.status(201);
			res.json(entity);
		});
	},

	'ngGetEntity': function (req, res) {
		Entity.findOne(req.param('id'))
		.populate('country')
		.exec(function (err, entity) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!entity) {
				res.status(404);
				res.json('Entity doesn\'t exist.');
			}
			else {
				var typeObj = entityTypes
		  		.filter(function(type) {
		  			return (type.id == entity.type);
		  		})[0];
		  		entity.type = typeObj;

				res.status(200);
				res.json(entity);
			}
		});
	},

	'ngGetEntityList': function (req, res) {

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

		Entity.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Entity.find(query)
				.populate('country')
				.exec(function (err, entities) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						var entitiesObj = [];
						entities.forEach(function(entity) {
							var typeObj = entityTypes
					  		.filter(function(type) {
					  			return (type.id == entity.type);
					  		})[0];
					  		entity.type = typeObj;
							entitiesObj.push(entity.toJSON());
						});

						res.status(200);
						res.json({total: total, entities: entitiesObj});
					}
				});
			}
		});
	},

	'ngUpdateEntity': function(req, res) {
		var entityObj = {
			entityid: req.param('entityid'),
			type: req.param('type'),
			name: req.param('name'),
			fullname: req.param('fullname'),
			telno: req.param('telno'),
			email: req.param('email'),
			country: req.param('country'),
			address: req.param('address')
		};
		Entity.update(req.param('id'), entityObj, function(err){
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
};
