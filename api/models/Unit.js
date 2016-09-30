/**
 * Unit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	schema: true,
	tableName: 'master_unit',
	attributes: {

		name: {
			type: 'string',
			required: true,
			unique: true,
			columnName: 'UnitName'
		},

		singular: {
			type: 'string',
			required: true,
			columnName: 'SingularUnit'
		},

		plural: {
			type: 'string',
			required: true,
			columnName: 'PluralUnit'
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

