angular.module('mainApp')
//Create New Item
.controller('ItemNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Item');

	$scope.item = {};

	$scope.unitid = null;
  	$scope.units = null;	

	$scope.categoryid = null;
  	$scope.categories = null;
  	
  	$scope.subcategoryid = null;
  	$scope.subcategories = null;

  	$scope.loadUnit = function() {
  		if ($scope.units == null) {
  			$http.post('/unit/ngGetUnits/')
			.then(function success(res) {
				$scope.units = res.data;
				console.log('loadUnit', $scope.units);
			})	
			.catch(function error(res) {
				$scope.units = null;
				myToast.simpleToast(res.data, 'warn');
			});	
  		}
  	};

  	$scope.selectUnit = function() {
  		if ($scope.unitid == null) {
  			$scope.item.unit = null;
  		}
  		else if ($scope.item.unit == null || $scope.unitid != $scope.item.unit.id) {
  			var unitObj = $scope.units
	  		.filter(function(unit) {
	  			return (unit.id == $scope.unitid);
	  		})[0];
	  		$scope.item.unit = unitObj;
  		}
  	};

  	$scope.loadCategory = function() {
  		if ($scope.categories == null) {
  			$http.post('/category/ngGetCategories/')
			.then(function success(res) {
				$scope.categories = res.data;
			})	
			.catch(function error(res) {
				$scope.categories = null;
				myToast.simpleToast(res.data, 'warn');
			});	
  		}
  	};

  	$scope.selectCategory = function() {
  		// console.log('selectCategory', $scope.categoryid);
  		if ($scope.categoryid == null) {
  			$scope.item.category = null;
  			$scope.item.subcategory = null;
  			$scope.subcategoryid = null;
  			$scope.subcategories = null;
  		}
  		else if ($scope.item.category == null || $scope.categoryid != $scope.item.category.id) {
  			var categoryObj = $scope.categories
	  		.filter(function(category) {
	  			return (category.id == $scope.categoryid);
	  		})[0];
	  		$scope.item.category = categoryObj;
	  		$scope.item.subcategory = null;
	  		$scope.subcategoryid = null;
	  		$scope.subcategories = categoryObj.subcategory;
  		}
  	};

  	$scope.selectSubcategory = function() {
  		if ($scope.subcategoryid == null) {
  			$scope.item.subcategory = null;
  		}
  		else if ($scope.item.subcategory == null || $scope.subcategoryid != $scope.item.subcategory.id) {
  			var subcategoryObj = $scope.subcategories
	  		.filter(function(subcategory) {
	  			return (subcategory.id == $scope.subcategoryid);
	  		})[0];
	  		$scope.item.subcategory = subcategoryObj;
  		}
  	};

  	// $scope.subcategories = ('CC1-1 CC1-2 CC1-3 CP1-1 CP1-2 CP1-3').split(' ').map(function(subitem) {
   //      return {name: subitem};
  	// });

	$scope.addItem = function() {
		console.log('addItem', $scope.item);
		if ($scope.newItemForm.$valid && $scope.item) {
			// console.log($scope.item);
			$http.post('/item/ngAddItem', $scope.item)
			.then(function success(res) {
				var itemObj = res.data;
				myToast.simpleToast('Item: ' + itemObj.itemid +' Created !', 'primary');
				// $state.go('itemshow', {
				// 	id: itemObj.id
				// });
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearItem = function() {
		$state.reload();
	};

}])
//Show & Edit Item
.controller('ItemShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$timeout', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, $timeout, myToast, myFocus) {
		
	$scope.showItem = function() {
		$scope.page.setTitle('Show Item');
		$scope.editMode = false;

		$http.post('/item/ngGetItem/' + $stateParams.id)
		.then(function success(res) {
			$scope.item = res.data;
			$scope.unitid = $scope.item.unit.id;
			$scope.categoryid = $scope.item.category.id;
			if (!$scope.item.subcategory) {
				$scope.subcategoryid = null;
			}
			else {
				$scope.subcategoryid = $scope.item.subcategory.id;	
			}
			$scope.loadUnit();
			$scope.loadCategory();
		})
		.catch(function error(res) {
			$scope.item = {};
			myToast.simpleToast(res.data, 'warn');
		});
	};
	//Get Item Information On Page Load 
	$scope.showItem();	

	$scope.editItem = function() {
		$scope.page.setTitle('Edit Item');
		var categoryObj = $scope.categories
  		.filter(function(category) {
  			return (category.id == $scope.item.category.id);
  		})[0];
  		$scope.subcategories = categoryObj.subcategory;
		$scope.editMode = true;
		myFocus.focusOn('itemid');
		$scope.item.remark += ' ';
		$scope.item.spec += ' ';
		// $scope.item.remark = $scope.item.remark.substr(0, $scope.item.remark.length-1);
		// $scope.item.spec = $scope.item.spec.substr(0, $scope.item.spec.length-1);
		$timeout(function() {
			$scope.item.remark = $scope.item.remark.substr(0, $scope.item.remark.length-1);
			$scope.item.spec = $scope.item.spec.substr(0, $scope.item.spec.length-1);
		}, 100);
	};

	$scope.loadUnit = function() {
		$http.post('/unit/ngGetUnits/')
		.then(function success(res) {
			$scope.units = res.data;
		})	
		.catch(function error(res) {
			$scope.units = null;
			myToast.simpleToast(res.data, 'warn');
		});	
  	};

  	$scope.selectUnit = function() {
  		if ($scope.unitid == null) {
  			$scope.item.unit = null;
  		}
  		else if ($scope.item.unit == null || $scope.unitid != $scope.item.unit.id) {
  			var unitObj = $scope.units
	  		.filter(function(unit) {
	  			return (unit.id == $scope.unitid);
	  		})[0];
	  		$scope.item.unit = unitObj;
  		}
  	};

	$scope.loadCategory = function() {
		$http.post('/category/ngGetCategories/')
		.then(function success(res) {
			$scope.categories = res.data;
		})	
		.catch(function error(res) {
			$scope.categories = null;
			myToast.simpleToast(res.data, 'warn');
		});	
  	};

  	$scope.selectCategory = function() {
  		console.log('selectCategory', $scope.categoryid);
  		if ($scope.categoryid == null) {
  			$scope.item.category = null;
  			$scope.item.subcategory = null;
  			$scope.subcategoryid = null;
  			$scope.subcategories = null;
  		}
  		else if ($scope.item.category == null || $scope.categoryid != $scope.item.category.id) {
  			var categoryObj = $scope.categories
	  		.filter(function(category) {
	  			return (category.id == $scope.categoryid);
	  		})[0];
	  		$scope.item.category = categoryObj;
	  		$scope.item.subcategory = null;
	  		$scope.subcategoryid = null;
	  		$scope.subcategories = categoryObj.subcategory;
  		}
  	};

  	$scope.selectSubcategory = function() {
  		if ($scope.subcategoryid == null) {
  			$scope.item.subcategory = null;
  		}
  		else if ($scope.item.subcategory == null || $scope.subcategoryid != $scope.item.subcategory.id) {
  			var subcategoryObj = $scope.subcategories
	  		.filter(function(subcategory) {
	  			return (subcategory.id == $scope.subcategoryid);
	  		})[0];
	  		$scope.item.subcategory = subcategoryObj;
  		}
  	};

	$scope.updateItem = function() {
		var itemObj = {
			itemid: $scope.item.itemid,
			name: $scope.item.name,
			unit: $scope.item.unit.id,
			category: $scope.item.category.id,
			subcategory: $scope.item.subcategory != null ? $scope.item.subcategory.id : null,
			remark: $scope.item.remark,
			spec: $scope.item.spec
		};
		$http.post('/item/ngUpdateItem/' + $scope.item.id, itemObj)
		.then(
			function success(res) {
				myToast.simpleToast('Item information updated !','primary');
				$scope.showItem();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listItem = function() {
		$state.go('itemlist');
	};

}])
//Item List
.controller('ItemList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;
	
	$scope.loading = true;
	$scope.page.setTitle('Item List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadItemList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadItemList();
	};

	$scope.loadItemList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		// console.log(p);
		$http({
	      url: '/item/ngGetItemList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.items = res.data.items;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadItemList();

	$scope.showItem = function(id) {
		if (id) {
			$state.go('itemshow', {id:id});
		}
	};

	$scope.newItem = function() {
		$state.go('itemnew');
	};

}]);