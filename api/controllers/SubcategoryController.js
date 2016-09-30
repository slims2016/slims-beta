/**
 * SubcategoryController
 *
 * @description :: Server-side logic for managing subcategories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'ngAddSubcategory': function (req, res) {
		Subcategory.create(req.params.all())
		.then(function(subcategory) {
			res.status(201);
			res.json(subcategory);
		});
	},

	'ngGetSubcategory': function (req, res) {
		Subcategory.findOne(req.param('id'), function (err, subcategory) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!subcategory) {
				res.status(404);
				res.json('Subategory doesn\'t exist.');
			}
			else {
				// console.log(subcategory);
				// res.status(200);
				// res.json(subcategory);

				Category.findOne(subcategory.category, function(err, category) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else if (!category) {
						res.status(404);
						res.json('Category doesn\'t exist.');
					}
					else {
						subcategory.category = category;
						res.status(200);
						res.json(subcategory);
					}
				});

			}
		});
	},

	'ngGetSubcategoryList': function (req, res) {

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

		Subcategory.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Subcategory.find(query)
				.exec(function (err, subcategories) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, subcategories: subcategories});
					}
				});
			}
		});
	},

	'ngUpdateSubcategory': function(req, res) {
		var subcategoryObj = {
			category: req.param('category'),
			name: req.param('name'),
			remark: req.param('remark')
		};
		Subcategory.update(req.param('id'), subcategoryObj, function(err){
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

