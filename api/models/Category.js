/**
 * Category.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
  	tableName: 'master_category',
	attributes: {
		
		name: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'CateName'
		},

		remark: {
			type: 'string',
			required: true,
			columnName: 'CateRemark'
		},

		props: {
			type: 'json',
			columnName: 'Property'
		},

		subcategory: {
			collection: 'subcategory',
			via: 'category'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}

	}
};

