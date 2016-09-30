/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'ngAddItem': function (req, res) {
		// console.log('ngAddItem params:', req.params.all());
		Item.create(req.params.all())
		.then(function(item) {
			res.status(201);
			// console.log('ngAddItem res:', item);
			res.json(item);
		});
	},

	'ngGetItem': function (req, res) {
		Item.findOne(req.param('id'))
		.populate('category')
		.populate('subcategory')
		.populate('unit')
		.exec(function (err, item) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else if (!item) {
				res.status(404);
				res.json('Item doesn\'t exist.');
			}
			else {
				res.status(200);
				res.json(item);
			}
		});
	},

	'ngGetItemList': function (req, res) {

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

		Item.count(query.where)
		.exec(function (err, total) {
			if (err) {
				res.status(err.status);
				res.json(err.details);
			}
			else {
				// console.log('find records: ' + total);
				Item.find(query)
				.populate('category')
				.populate('subcategory')
				.populate('unit')
				.exec(function (err, items) {
					if (err) {
						res.status(err.status);
						res.json(err.details);
					}
					else {
						res.status(200);
						res.json({total: total, items: items});
					}
				});
			}
		});
	},

	'ngUpdateItem': function(req, res) {
		var itemObj = {
			itemid: req.param('itemid'),
			name: req.param('name'),
			unit: req.param('unit'),
			category: req.param('category'),
			subcategory: req.param('subcategory'),
			remark: req.param('remark'),
			spec: req.param('spec')
		};
		Item.update(req.param('id'), itemObj, function(err){
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

