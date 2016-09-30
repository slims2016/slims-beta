angular.module('mainApp')
//Create New User
.controller('UserNew', ['$scope', '$http', '$state', '$mdDialog', 'myToast',
function($scope, $http, $state, $mdDialog, myToast) {

	$scope.page.setTitle('Create User');

	$scope.addUser = function() {
		if ($scope.newUserForm.$valid && $scope.user) {
			// $scope.user._csrf = csrf;
			console.log(JSON.stringify($scope.user));
			// $http.post("/api/add_user", $scope.user)
			$http.post('/user/ngAddUser', $scope.user)
			.then(function success(res) {
				var userObj = res.data;
				myToast.simpleToast('User: ' + userObj.username +' Created !', 'primary');
				$state.go('usershow', {
					id: userObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearUser = function() {
		$state.reload();
	}

	// mdDialog section
	$scope.showAlert = function(ev, title, message, button) {
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		$mdDialog.show(
			$mdDialog.alert()
				// .parent(angular.element(document.querySelector('#newUserForm')))
				.clickOutsideToClose(true)
				.title(typeof title == 'undefined' ? 'Title' : title)
				.textContent(typeof message == 'undefined' ? 'Message' : message)
				.ok(typeof button == 'undefined' ? 'OK' : button)
				.targetEvent(ev)
		);
	};
}])
//Show & Edit User & Change Password
// .controller('UserShow', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
.controller('UserShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, myToast, myFocus) {
	
	$scope.showUser = function() {
		$scope.page.setTitle('Show User');
		$scope.editMode = false;
		$scope.passMode = false;
		$scope.order = '';
		$scope.selected = [];

		$http.post('/user/ngGetUser/' + $stateParams.id)
		.then(function success(res) {
			$scope.user = res.data;
			$scope.canChangePassword = $rootScope.rootUser.id == $scope.user.id;
		})
		.catch(function error(res) {
			$scope.user = {};
			$scope.canChangePassword = false;
			myToast.simpleToast(res.data, 'warn');
		});

	}
	//Get User Information On Page Load 
	$scope.showUser();	

	$scope.editUser = function() {
		$scope.page.setTitle('Edit User');
		$scope.editMode = true;
		$scope.order = '';
		$scope.selected = [];
		
		if (!$scope.roles) {
			$http.get('/role/ngGetRoles/')
			.then(
				function (res) {
					$scope.roles = res.data;
				}
			);
		}
		
		$scope.user.roles.forEach(function(role) {
			$scope.selected.push(role.id);
		});

		myFocus.focusOn('fullname');
	};

	$scope.updateUser = function() {
		var userObj = {
			username: $scope.user.username,
			fullname: $scope.user.fullname,
			email: $scope.user.email,
			roles: $scope.selected
		};
		// console.log(userObj);
		$http.post('/user/ngUpdateUser/' + $scope.user.id, userObj)
		.then(
			function success(res) {
				myToast.simpleToast('User information updated !','primary');
				$scope.showUser();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listUser = function() {
		$state.go('userlist');
		// window.location = '#/user/list';
	};

	$scope.showPassword = function() {
		$scope.passMode = true;
	};

	$scope.hidePassword = function() {
		$scope.passMode = false;
	};

	$scope.savePassword = function() {
		var userObj = {
			password: $scope.user.password,
			newpassword: $scope.user.newpassword,
			confirmation: $scope.user.confirmation
		};
		// console.log(userObj);
		$http.post('/user/ngUpdatePassword/' + $scope.user.id, userObj)
		.then(
			function success(res) {
				myToast.simpleToast('User password updated !','primary');
				$scope.showUser();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};
}])
//User List
.controller('UserList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('User List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadUserList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadUserList();
	};

	$scope.loadUserList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		// console.log(p);
		$http({
	      url: '/user/ngGetUserList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.users = res.data.users;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadUserList();

	$scope.showUser = function(id) {
		if (id) {
			// console.log(id);
			$state.go('usershow', {id:id});
			// window.location = '#/user/show/' + id;	
		}
	};

	$scope.newUser = function() {
		// console.log('newUser');
		// window.location = '#/user/new';
		$state.go('usernew');
	};
}]);
