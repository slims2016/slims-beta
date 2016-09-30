/**
 * UnitController
 *
 * @description :: Server-side logic for managing units
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'ngAddUnit': function (req, res) {
		Unit.create(req.params.all())
		.then(function(unit) {
			res.status(201);
			res.json(unit);
		});
	},

	'ngGetUnit': function (req, res) {
		Unit.findOne(req.param('id'), function (err, unit) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!unit) {
				res.status(404);
				res.json('Unit doesn\'t exist.');
			}
			else {
				res.status(200);
				res.json(unit);
			}
		});
	},

	'ngGetUnits': function (req, res) {

		Unit.find(function (err, units) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				res.status(200);
				res.json(units);
			}
		});

	},

	'ngGetUnitList': function (req, res) {

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

		Unit.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Unit.find(query)
				.exec(function (err, units) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, units: units});
					}
				});
			}
		});
	},

	'ngUpdateUnit': function(req, res) {
		var unitObj = {
			name: req.param('name'),
			singular: req.param('singular'),
			plural: req.param('plural')
		};
		Unit.update(req.param('id'), unitObj, function(err){
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

