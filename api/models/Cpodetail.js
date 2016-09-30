/**
 * Cpodetail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
	tableName: 'customerpo_detail',
	attributes: {

		seqno: {
			type: 'integer',
			required: true,
			columnName: 'SeqNo'
		},

		itemid: {
			type: 'string',
			required: true,
			columnName: 'ItemId'
		},

		item: {
			model: 'item',
			required: true,
			columnName: 'Item'
		},

		quantity: {
			type: 'float',
			required: true,
			columnName: 'Quantity'
		},

		price: {
			type: 'float',
			required: true,
			columnName: 'Price'
		},

		custitemid: {
			type: 'string',
			columnName: 'CustItemId'
		},

		etd: {
			type: 'date',
			columnName: 'ETDDate'
		},

		eta: {
			type: 'date',
			columnName: 'ETADate'
		},

		props:  {
			type: 'json',
			columnName: 'Property'
		},

		cpoid: {
			model: 'cpoheader',
			columnName: 'CpoId'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
	}
};

