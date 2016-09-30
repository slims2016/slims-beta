angular.module('mainApp')
//Create New Subcategory
.controller('SubcategoryNew', ['$scope', '$http', '$state', '$stateParams', 'myToast',
function($scope, $http, $state, $stateParams, myToast) {

	$scope.page.setTitle('Create Sub Category');

	$scope.showCategory = function() {
		$http.post('/category/ngGetCategory/' + $stateParams.id)
		.then(function success(res) {
			$scope.category = res.data;
		})
		.catch(function error(res) {
			$scope.category = {};
			myToast.simpleToast(res.data, 'warn');
		});
	};
	$scope.showCategory();

	$scope.addSubcategory = function() {
		if ($scope.newSubcategoryForm.$valid && $scope.subcategory) {
			$scope.subcategory.category = $scope.category.id;
			$http.post('/subcategory/ngAddSubcategory', $scope.subcategory)
			.then(function success(res) {
				var subcategoryObj = res.data;
				myToast.simpleToast('Subcategory: ' + subcategoryObj.name +' Created !', 'primary');
				$state.go('subcategoryshow', {
					id: subcategoryObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearSubcategory = function() {
		$state.reload();
	}

}])
//Show & Edit Subcategory
.controller('SubcategoryShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, myToast, myFocus) {
	
	$scope.showSubcategory = function() {
		$scope.page.setTitle('Show Sub Category');
		$scope.editMode = false;

		$http.post('/subcategory/ngGetSubcategory/' + $stateParams.id)
		.then(function success(res) {
			$scope.subcategory = res.data;
		})
		.catch(function error(res) {
			$scope.subcategory = {};
			myToast.simpleToast(res.data, 'warn');
		});

	}
	//Get Subcategory Information On Page Load 
	$scope.showSubcategory();	

	$scope.editSubcategory = function() {
		$scope.page.setTitle('Edit Sub Category');
		$scope.editMode = true;
		myFocus.focusOn('subcategoryname');
	};

	$scope.updateSubcategory = function() {
		var subcategoryObj = {
			category: $scope.subcategory.category.id,
			name: $scope.subcategory.name,
			remark: $scope.subcategory.remark
		};
		$http.post('/subcategory/ngUpdateSubcategory/' + $scope.subcategory.id, subcategoryObj)
		.then(
			function success(res) {
				myToast.simpleToast('Subcategory information updated !','primary');
				$scope.showSubcategory();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listSubcategory = function() {
		$state.go('subcategorylist', {id: $scope.subcategory.category.id});
	};

}])
//Subcategory List
.controller('SubcategoryList', ['$scope', '$http', '$state', '$stateParams','myToast', function($scope, $http, $state, $stateParams, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('Sub Category List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {category: $stateParams.id}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadSubcategoryList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadSubcategoryList();
	};

	$scope.loadSubcategoryList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		
		$http.post('/category/ngGetCategory/' + $stateParams.id)
		.then(function success(res) {
			$scope.category = res.data;
		})
		.catch(function error(res) {
			$scope.category = {};
			myToast.simpleToast(res.data, 'warn');
		});

		$http({
	      url: '/subcategory/ngGetSubcategoryList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.subcategories = res.data.subcategories;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadSubcategoryList();

	$scope.showSubcategory = function(id) {
		if (id) {
			$state.go('subcategoryshow', {id:id});
		}
	};

	$scope.newSubcategory = function() {
		if ($scope.category.id)
		{
			$state.go('subcategorynew', {id: $scope.category.id});
		}
		
	};

	$scope.listCategory = function() {
		$state.go('categorylist');
	};

}]);
