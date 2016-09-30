/**
 * Entity.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	schema: true,
	tableName: 'master_entity',
	attributes: {

		entityid: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'EntityId'
		},

		type: {
			type: 'integer',
			enum: [0, 1, 2], //0-Mix, 1-Customer, 2-Vendor
			defaultsTo: 0
		},

		name: {
			type: 'string',
			required: true,
			columnName: 'EntityName'
		},

		fullname: {
			type: 'string',
			required: true,
			columnName: 'EntityFullName'
		},

		telno: {
			type: 'string',
			columnName: 'TelNo'
		},

		email: {
			type: 'email',
			columnName: 'Email'
		},

		country: {
			model: 'country',
			columnName: 'CountryId',
		},

		address: {
			type: 'string',
			columnName: 'Address'
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

