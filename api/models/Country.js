/**
 * Country.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
	tableName: 'master_country',
	attributes: {

		code: {
			type: 'string',
			required: true,
			unique: true,
			size: 3,
			minLength: 3,
			columnName: 'CountryCode'
		},

		name: {
			type: 'string',
			required: true,
			columnName: 'CountryName'
		},

		fullname: {
			type: 'string',
			columnName: 'CountryFullName'
		},

		frequency: {
			type: 'integer',
			columnName: 'Frequency',
			defaultsTo: 0
		},

		numeric3: {
			type: 'string',
			size: 3,
			minLength: 3,
			columnName: 'NumericCode3'
		},

		code2: {
			type: 'string',
			size: 2,
			minLength: 2,
			columnName: 'AlphaCode2'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
	}
};

