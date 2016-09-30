/**
 * Cpoheader.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
  	tableName: 'customerpo_header',
	attributes: {

		cponumber: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'CPONumber'
		},

		custid: {
			type: 'string',
			required: true,
			columnName: 'CustomerId'
		},

		entity: {
			model: 'entity',
			required: true,
			columnName: 'EntityId'
		},

		cpodate: {
			type: 'date',
			columnName: 'CPODate'
		},

		payment: {
			type: 'string',
			columnName: 'PaymentTerm'
		},

		term: {
			type: 'string',
			columnName: 'PriceTerm'
		},

		remark: {
			type: 'string',
			columnName: 'CPORemark'
		},

		props:  {
			type: 'json',
			columnName: 'Property'
		},

		cpodetail: {
			collection: 'cpodetail',
			via: 'cpoid'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
	}
};

