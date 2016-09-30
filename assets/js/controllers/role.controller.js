angular.module('mainApp')
//Create New Role
.controller('RoleNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Role');

	$scope.addRole = function() {
		if ($scope.newRoleForm.$valid && $scope.role) {
			console.log('addRole');
			console.log($scope.role);
			$http.post('/role/ngAddRole', $scope.role)
			.then(function success(res) {
				var roleObj = res.data;
				myToast.simpleToast('Role: ' + roleObj.name +' Created !', 'primary');
				$state.go('roleshow', {
					id: roleObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearRole = function() {
		$state.reload();
	}

}])
//Show & Edit Role
.controller('RoleShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, myToast, myFocus) {
	
	$scope.showRole = function() {
		$scope.page.setTitle('Show Role');
		$scope.editMode = false;

		$http.post('/role/ngGetRole/' + $stateParams.id)
		.then(function success(res) {
			$scope.role = res.data;
		})
		.catch(function error(res) {
			$scope.role = {};
			myToast.simpleToast(res.data, 'warn');
		});

	}
	//Get Role Information On Page Load 
	$scope.showRole();	

	$scope.editRole = function() {
		$scope.page.setTitle('Edit Role');
		$scope.editMode = true;
		myFocus.focusOn('rolename');
	};

	$scope.updateRole = function() {
		var roleObj = {
			name: $scope.role.name,
			remark: $scope.role.remark
		};
		$http.post('/role/ngUpdateRole/' + $scope.role.id, roleObj)
		.then(
			function success(res) {
				myToast.simpleToast('Role information updated !','primary');
				$scope.showRole();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listRole = function() {
		$state.go('rolelist');
	};

}])
//Role List
.controller('RoleList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('Role List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadRoleList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadRoleList();
	};

	$scope.loadRoleList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		// console.log(p);
		$http({
	      url: '/role/ngGetRoleList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.roles = res.data.roles;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadRoleList();

	$scope.showRole = function(id) {
		if (id) {
			$state.go('roleshow', {id:id});
		}
	};

	$scope.newRole = function() {
		$state.go('rolenew');
	};

}]);
