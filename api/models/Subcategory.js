/**
 * Subcategory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
  	tableName: 'master_subcategory',
	attributes: {
		
		name: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'SubcateName'
		},

		remark: {
			type: 'string',
			columnName: 'SubcateRemark'
		},

		props: {
			type: 'json',
			columnName: 'Property'
		},

		category: {
			model: 'category',
			columnName: 'CategoryId'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}

	}
};


