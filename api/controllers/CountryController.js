/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'ngAddCountry': function (req, res) {
		Country.create(req.params.all())
		.then(function(country) {
			res.status(201);
			res.json(country);
		});
	},

	'ngGetCountry': function (req, res) {
		Country.findOne(req.param('id'))
		.exec(function (err, country) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!country) {
				res.status(404);
				res.json('Country doesn\'t exist.');
			}
			else {
				res.status(200);
				res.json(country);
			}
		});
	},

	'ngGetCountries': function (req, res) {

		Country.find()
		.exec(function (err, countries) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				res.status(200);
				res.json(countries);
			}
		});

	},

	'ngGetCountryList': function (req, res) {

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

		Country.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				Country.find(query)
				.exec(function (err, countries) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, countries: countries});
					}
				});
			}
		});
	},

	'ngUpdateCountry': function(req, res) {
		var countryObj = {
			code: req.param('code'),
			name: req.param('name'),
			fullname: req.param('fullname'),
			code2: req.param('code2'),
			numeric3: req.param('numeric3')
		};
		Country.update(req.param('id'), countryObj, function(err){
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

