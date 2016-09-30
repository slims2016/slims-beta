/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,
	tableName: 'master_role',
	attributes: {

		name: {
			type: 'string',
			required: true,
			columnName: 'RoleName'
		},

		remark: {
			type: 'string',
			required: true,
			columnName: 'RoleRemark'
		},

		users: {
			collection: 'user',
			via: 'roles'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
		
	}
};

