angular.module('mainApp')
//Create New Category
.controller('CategoryNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Category');

	$scope.addCategory = function() {
		if ($scope.newCategoryForm.$valid && $scope.category) {
			console.log('addCategory');
			console.log($scope.category);
			$http.post('/category/ngAddCategory', $scope.category)
			.then(function success(res) {
				var categoryObj = res.data;
				myToast.simpleToast('Category: ' + categoryObj.name +' Created !', 'primary');
				$state.go('categoryshow', {
					id: categoryObj.id
				});
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearCategory = function() {
		$state.reload();
	}

}])
//Show & Edit Category
.controller('CategoryShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, myToast, myFocus) {
	
	$scope.showCategory = function() {
		$scope.page.setTitle('Show Category');
		$scope.editMode = false;

		$http.post('/category/ngGetCategory/' + $stateParams.id)
		.then(function success(res) {
			$scope.category = res.data;
		})
		.catch(function error(res) {
			$scope.category = {};
			myToast.simpleToast(res.data, 'warn');
		});
	};
	//Get Category Information On Page Load 
	$scope.showCategory();	

	$scope.editCategory = function() {
		$scope.page.setTitle('Edit Category');
		$scope.editMode = true;
		myFocus.focusOn('categoryname');
	};

	$scope.updateCategory = function() {
		var categoryObj = {
			name: $scope.category.name,
			remark: $scope.category.remark
		};
		$http.post('/category/ngUpdateCategory/' + $scope.category.id, categoryObj)
		.then(
			function success(res) {
				myToast.simpleToast('Category information updated !','primary');
				$scope.showCategory();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listCategory = function() {
		$state.go('categorylist');
	};

}])
//Category List
.controller('CategoryList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('Category List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadCategoryList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadCategoryList();
	};

	$scope.loadCategoryList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		// console.log(p);
		$http({
	      url: '/category/ngGetCategoryList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.categories = res.data.categories;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadCategoryList();

	$scope.showCategory = function(id) {
		if (id) {
			$state.go('categoryshow', {id: id});
		}
	};

	$scope.showSubcategory = function(event, id) {
		event.stopPropagation();
		console.log('showSubcategory');
		console.log(id);
		$state.go('subcategorylist', {id: id});
	}

	$scope.addSubcategory = function(event, id) {
		event.stopPropagation();
		console.log('addSubcategory');
		console.log(id);
		$state.go('subcategorynew', {id: id});
	}

	$scope.newCategory = function() {
		$state.go('categorynew');
	};

}]);
