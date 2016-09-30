angular.module('mainApp')
.controller('UserController', ['$scope', '$http', '$mdToast', '$mdDialog', '$window', function($scope, $http, $mdToast, $mdDialog, $window) {

	// console.log(JSON.stringify($routeParams));

	$scope.createUser = function(csrf) {
		if ($scope.user) {
			$scope.user._csrf = csrf;
			console.log(JSON.stringify($scope.user));
			// $http.post("/api/add_user", $scope.user)
			$http.post("/user/ngAddUser", $scope.user)
			.then(
				function success(res) {
					console.log('success');
					console.log(JSON.stringify(res.data));
					// console.log(JSON.stringify(res.data.id));
					$window.location.href = '/user/show/' + JSON.stringify(res.data.id);
				},
				function error(res) {
					console.log('error');
					console.log(JSON.stringify(res.data));
					$scope.showSimpleToast(res.data, 'warn');
					$scope.showAlert(null, 'Create User Error', res.data, 'Close');
				}
			);
		}
	};

	$scope.clearUser = function() {
		if ($scope.user) {
			$scope.user = {};
		}
	}

	// mdToast section
	var tPos = {
		bottom: true,
		top: false,
		left: false,
		right: true
	};

	$scope.toastPosition = angular.extend({},tPos);
	$scope.getToastPosition = function() {
		return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
	};

	$scope.showSimpleToast = function(msg, theme) {
		var pinTo = $scope.getToastPosition();
		$mdToast.show(
		  $mdToast.simple()
			.textContent(msg)
			.position(pinTo)
			.theme(theme)
			.hideDelay(3000)
		);
	};

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
.controller('UserEdit', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

	$scope.page.setTitle('Edit User');
	$scope.edit = false; //false: show; true: edit
	$scope.order = '';
	$scope.selected = [];

	$http.get('/role/ngGetRoles/')
	.then(
		function (res) {
			$scope.roles = res.data;
		}
	);

	$http.get('/user/ngGetUser/' + $routeParams.id)
	.then(
		function (res) {
			$scope.user = res.data;
			$scope.user.roles.forEach(function(role) {
				$scope.selected.push(role.id);
			});
		}
	);

	$scope.showUser = function() {
		window.location = '#/user/' + $scope.user.id;
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
				// console.log('res.data');
				// console.log(res.data);
				window.location = '#/user/' + $scope.user.id;
			},
			function error(res) {
				console.log('error');
				console.log(res.data);
			}
		);
	};
}])
.controller('NaviHome', ['$scope', '$rootScope', 'UserSession', 'myToast', function($scope, $rootScope, UserSession, myToast) {

	$scope.page.setTitle('Home');

	$scope.loading = false;
	$scope.btnLogin = "Login";
	$scope.user = {};
	$scope.userLogin = function() {

		if ($scope.loading) {
			return;
		}

		if (!$scope.user || !$scope.user.username || !$scope.user.password) {
			myToast.simpleToast('User name and password required.', 'warn');
			return;
		}

		$scope.loading = true;
		$scope.btnLogin = "Login ...";
		UserSession.csrfToken().then(function() {
			UserSession.loginUser($scope.user.username, $scope.user.password)
			.then(function (user) {
				// console.log('login');
				// console.log(user);
				$rootScope.rootUser = user;
				$rootScope.rootAuth = user != undefined;
				myToast.simpleToast('Welcome back, ' + user.username + ' !' , 'primary');
			})
			.catch(function (err) {
				// console.log('catch');
				// console.log(err);
				$rootScope.rootUser = undefined;
				$rootScope.rootAuth = false;
				myToast.simpleToast(err.data, 'warn');
			})
			.finally(function() {
				$scope.user = {};
				$scope.loading = false;
				$scope.btnLogin = "Login";
			});
		});
	};
}])
//User Login
.controller('UserLogin', ['$scope', '$http', 'UserSession', function($scope, $http, UserSession) {
	$scope.page.setTitle('User Login');
	$scope.loading = false;
	$scope.userLogin =  function() {
		
		if (!$scope.user || !$scope.user.username || !$scope.user.password) {
			return;
		}

		$scope.loading = true;		

		$http.put('/session/ngLoginUser', {
			username: $scope.user.username,
			password: $scope.user.password
		})
		.then(function success(res) {
			console.log(res.status);
			console.log(res.data);
			$scope.user = Session.getUser();
			$scope.authenticated = Session.isAuthenticated();
			console.log($scope.user);
			console.log($scope.authenticated);
		})
		.catch(function error(res) {
			console.log(res.status);
			console.log(res.data);
		})
		.finally(function() {
			$scope.loading = false;
		});
	};
}]);