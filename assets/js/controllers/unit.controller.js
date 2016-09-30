angular.module('mainApp')
//Create New Unit
.controller('UnitNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Unit');

	$scope.addUnit = function() {
		if ($scope.newUnitForm.$valid && $scope.unit) {
			console.log('addUnit');
			console.log($scope.unit);
			$http.post('/unit/ngAddUnit', $scope.unit)
			.then(function success(res) {
				var unitObj = res.data;
				myToast.simpleToast('Unit: ' + unitObj.name +' Created !', 'primary');
				$state.go('unitshow', {
					id: unitObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearUnit = function() {
		$state.reload();
	}

}])
//Show & Edit Unit
.controller('UnitShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, myToast, myFocus) {
	
	$scope.showUnit = function() {
		$scope.page.setTitle('Show Unit');
		$scope.editMode = false;

		$http.post('/unit/ngGetUnit/' + $stateParams.id)
		.then(function success(res) {
			$scope.unit = res.data;
		})
		.catch(function error(res) {
			$scope.unit = {};
			myToast.simpleToast(res.data, 'warn');
		});
	};
	//Get Unit Information On Page Load 
	$scope.showUnit();	

	$scope.editUnit = function() {
		$scope.page.setTitle('Edit Unit');
		$scope.editMode = true;
		myFocus.focusOn('unitname');
	};

	$scope.updateUnit = function() {
		var unitObj = {
			name: $scope.unit.name,
			singular: $scope.unit.singular,
			plural: $scope.unit.plural
		};
		$http.post('/unit/ngUpdateUnit/' + $scope.unit.id, unitObj)
		.then(
			function success(res) {
				myToast.simpleToast('Unit information updated !','primary');
				$scope.showUnit();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listUnit = function() {
		$state.go('unitlist');
	};

}])
//Unit List
.controller('UnitList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('Unit List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadUnitList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadUnitList();
	};

	$scope.loadUnitList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		// console.log(p);
		$http({
	      url: '/unit/ngGetUnitList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.units = res.data.units;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadUnitList();

	$scope.showUnit = function(id) {
		if (id) {
			$state.go('unitshow', {id:id});
		}
	};

	$scope.newUnit = function() {
		$state.go('unitnew');
	};

}]);