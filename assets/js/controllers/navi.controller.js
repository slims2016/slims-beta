angular.module('mainApp')
.controller('NaviCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', '$timeout', 'UserSession', 'myToast', 'myFocus',
	function($scope, $rootScope, $http, $state, $mdDialog, $timeout, UserSession, myToast, myFocus) {


	$scope.polymer = "\&\#xe8ab\;";
	// console.log('$state.current.name: ' + $state.current.name);
	// console.log($state.get);

	// $scope.isHomePage = $rootScope.$state.is('home');
	if (!$scope.isPrivatePage) {
		// window.location = '/#/';
	}

	$scope.naviLogin = function(event) {
		$rootScope.rootUser = undefined;
		$rootScope.rootAuth = false;

		// console.log(event);
		$mdDialog.show({
			controller: LoginCtrl,
			templateUrl: 'templates/user/login.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false
		})
		.then(function (user) {
			// console.log(user);
			$rootScope.rootUser = user;
			$rootScope.rootAuth = user != undefined;
			// console.log('NaviCtrl csrfToken');
			// UserSession.csrfToken();
			// console.log("$state");
			// console.log($state.current);
			// if ($rootScope.isPrivatePage) {
			// 	if (!$rootScope.$state.current.keepdata) {
			// 		console.log('login reload');
			// 		// $state.reload();
			// 	}
			// }
			myToast.simpleToast('Welcome back, ' + user.username + ' !' , 'primary');
		});

	};

	$scope.naviLogout = function(toState) {

		UserSession.logoutUser()
		.finally(function() {
			var username = $rootScope.rootUser.username;
			$rootScope.rootUser = undefined;
			$rootScope.rootAuth = false;
			myToast.simpleToast('Goodbye' + (typeof username == 'undefined' ? ' !' : ', ' + username + ' !'), 'default');	
			$state.go('home');
		});
		// .then(function(res) {
		// 	$rootScope.rootUser = undefined;
		// 	$rootScope.rootAuth = false;
		// 	console.log('UserSession.logoutUser');
		// });
		// console.log('naviLogout');
	};

	$scope.countryList = function() {
		$state.go('countrylist');
	};

	$scope.entityList = function() {
		$state.go('entitylist');
	};

	$scope.userList = function() {
		$state.go('userlist');
	};

	$scope.roleList = function() {
		$state.go('rolelist');
	};

	$scope.itemList = function() {
		$state.go('itemlist');
	};

	$scope.categoryList = function() {
		$state.go('categorylist');
	};

	$scope.unitList = function() {
		$state.go('unitlist');
	};

	$scope.userShow = function() {
		if ($rootScope.rootUser) {
			$state.go('usershow', {
				id: $rootScope.rootUser.id
			});
		}
	};

	// Controller for Dialog
	function LoginCtrl($scope, $http, $mdDialog, $timeout, UserSession, myFocus) {
		
		// angular.element('#loginUserName').focus();
		
		$scope.loading = false;
		$scope.btnLogin = "Login";

		$timeout(function() {
			myFocus.focusOn("username");
		}, 500);
		
		$scope.userLogin = function() {

			if (!$scope.user || !$scope.user.username || !$scope.user.password) {
				$mdDialog.cancel();
				return;
			}

			$scope.loading = true;
			$scope.btnLogin = "Login ...";
			UserSession.csrfToken(function() {
				UserSession.loginUser($scope.user.username, $scope.user.password)
				.then(function (user) {
					$mdDialog.hide(user);
				})
				.catch(function (res) {
					console.log('LoginCtrl');
					console.log(res.data);
					$mdDialog.cancel();
				})
				.finally(function() {
					$scope.loading = false;
					$scope.btnLogin = "Login";
				});
			});

		};
	}
}])
.controller('NaviHome', ['$scope', function($scope){
	$scope.page.setTitle('Home');
}]);