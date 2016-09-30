/**
 * Item.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
	tableName: 'master_item',
	attributes: {

		itemid: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'ItemId'
		},

		name: {
			type: 'string',
			required: true,
			columnName: 'ItemName'
		},

		category: {
			model: 'category',
			required: true,
			columnName: 'CategoryId',
		},

		subcategory: {
			model: 'subcategory',
			columnName: 'SubcategoryId',
		},

		unit: {
			model: 'unit',
			required: true,
			columnName: 'UnitId'
		},

		remark: {
			type: 'string',
			columnName: 'ItemRemark'
		},

		spec: {
			type: 'string',
			columnName: 'Specification'
		},

		picture: {
			type: 'string',
			columnName: 'Picture'
		},

		props: {
			type: 'json',
			columnName: 'Property'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}

	}
};
