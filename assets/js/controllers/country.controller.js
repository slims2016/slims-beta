angular.module('mainApp')
//Create New Country
.controller('CountryNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Country');

	$scope.addCountry = function() {
		if ($scope.newCountryForm.$valid && $scope.country) {
			$http.post('/country/ngAddCountry', $scope.country)
			.then(function success(res) {
				var countryObj = res.data;
				myToast.simpleToast('Country: ' + countryObj.code +' Created !', 'primary');
				$state.go('countryshow', {
					id: countryObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearCountry = function() {
		$state.reload();
	}

}])
//Show & Edit Country
.controller('CountryShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$timeout', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, $timeout, myToast, myFocus) {
		
	$scope.showCountry = function() {
		$scope.page.setTitle('Show Country');
		$scope.editMode = false;

		$http.post('/country/ngGetCountry/' + $stateParams.id)
		.then(function success(res) {
			$scope.country = res.data;
		})
		.catch(function error(res) {
			$scope.country = {};
			myToast.simpleToast(res.data, 'warn');
		});
	};
	//Get Country Information On Page Load 
	$scope.showCountry();	

	$scope.editCountry = function() {
		$scope.page.setTitle('Edit Country');
		$scope.editMode = true;
		myFocus.focusOn('code');
		$timeout(function() {
			$scope.country.address = $scope.country.address.substr(0, $scope.country.address.length-1);
		}, 100);
	};

	$scope.updateCountry = function() {
		var countryObj = {
			code: $scope.country.code,
			name: $scope.country.name,
			fullname: $scope.country.fullname,
			code2: $scope.country.code2,
			numeric3: $scope.country.numeric3
		};

		$http.post('/country/ngUpdateCountry/' + $scope.country.id, countryObj)
		.then(
			function success(res) {
				myToast.simpleToast('Country information updated !','primary');
				$scope.showCountry();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listCountry = function() {
		$state.go('countrylist');
	};

}])
//Country List
.controller('CountryList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;

	$scope.loading = true;
	$scope.page.setTitle('Country List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadCountryList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadCountryList();
	};

	$scope.loadCountryList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		$http({
	      url: '/country/ngGetCountryList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.countries = res.data.countries;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadCountryList();

	$scope.showCountry = function(id) {
		if (id) {
			$state.go('countryshow', {id:id});
		}
	};

	$scope.newCountry = function() {
		$state.go('countrynew');
	};

}]);