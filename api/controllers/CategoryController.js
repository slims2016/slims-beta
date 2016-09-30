/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'ngAddCategory': function (req, res) {
		Category.create(req.params.all())
		.then(function(category) {
			res.status(201);
			res.json(category);
		});
	},

	'ngGetCategory': function (req, res) {
		Category.findOne(req.param('id'), function (err, category) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!category) {
				res.status(404);
				res.json('Category doesn\'t exist.');
			}
			else {
				res.status(200);
				res.json(category);
			}
		});
	},

	'ngGetCategories': function (req, res) {

		Category.find()
		.populate('subcategory')
		.exec(function (err, categories) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				res.status(200);
				res.json(categories);
			}
		});

	},

	'ngGetCategoryList': function (req, res) {

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

		Category.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Category.find(query)
				.exec(function (err, categories) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, categories: categories});
					}
				});
			}
		});
	},

	'ngUpdateCategory': function(req, res) {
		var categoryObj = {
			name: req.param('name'),
			remark: req.param('remark')
		};
		Category.update(req.param('id'), categoryObj, function(err){
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

