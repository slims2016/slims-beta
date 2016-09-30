angular.module('mainApp')
//Create New Entity
.controller('EntityNew', ['$scope', '$http', '$state', 'myToast',
function($scope, $http, $state, myToast) {

	$scope.page.setTitle('Create Entity');

	$scope.entity = {};

	$scope.typeid = null;
  	$scope.types = [{id:0,name:'Mixed'},{id:1,name:'Customer'},{id:2,name:'Vendor'}];	

  	$scope.countryid = null;
  	$scope.countries = null;
  	$scope.countryname = null;

  	$scope.selectType = function() {
  		if ($scope.typeid == null) {
  			$scope.entity.type = null;
  		}
  		else if ($scope.entity.type == null || $scope.typeid != $scope.entity.type) {
  			var typeObj = $scope.types
	  		.filter(function(type) {
	  			return (type.id == $scope.typeid);
	  		})[0];
	  		$scope.entity.type = typeObj.id;
  		}
  	};

  	$scope.loadCountry = function() {
  		if ($scope.countries == null) {
  			$http.post('/country/ngGetCountries/')
			.then(function success(res) {
				$scope.countries = res.data;
				// console.log('loadUnit', $scope.countries);
			})	
			.catch(function error(res) {
				$scope.countries = null;
				myToast.simpleToast(res.data, 'warn');
			});	
  		}
  	};

  	$scope.selectCountry = function() {
  		if ($scope.countryid == null) {
  			$scope.entity.country = null;
  		}
  		else if ($scope.entity.country == null || $scope.countryid != $scope.entity.country.id) {
  			var countryObj = $scope.countries
	  		.filter(function(country) {
	  			return (country.id == $scope.countryid);
	  		})[0];
	  		$scope.entity.country = countryObj;
  		}
  	};

  	$scope.getCountryName = function() {
  		if ($scope.countryid != null) {
  			// console.log('getCountryName not null', $scope.countryid);
  			var countryObj = $scope.countries
	  		.filter(function(country) {
	  			return (country.id == $scope.countryid);
	  		})[0];
	  		$scope.countryname = countryObj.name + ' - ' + countryObj.code;
	  		return countryObj.name;
  		}
  		else {
  			// console.log('getCountryName is null', $scope.countryid);
  			$scope.countryname = null;
  			return 'Country';
  		}
  	};

	$scope.addEntity = function() {
		// console.log('addEntity', $scope.entity);
		if ($scope.newEntityForm.$valid && $scope.entity) {
			// console.log($scope.entity);
			$http.post('/entity/ngAddEntity', $scope.entity)
			.then(function success(res) {
				var entityObj = res.data;
				myToast.simpleToast('Entity: ' + entityObj.entityid +' Created !', 'primary');
				// $state.go('entitieshow', {
				// 	id: entityObj.id
				// });
			})
			.catch(function error(res) {
				myToast.simpleToast(res.data, 'warn');
			});
		}
	};

	$scope.clearEntity = function() {
		$state.reload();
	};

}])
//Show & Edit Entity
.controller('EntityShow', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$timeout', 'myToast', 'myFocus',
function($scope, $rootScope, $http, $state, $stateParams, $timeout, myToast, myFocus) {
		
	$scope.types = [{id:0,name:'Mixed'},{id:1,name:'Customer'},{id:2,name:'Vendor'}];

	$scope.showEntity = function() {
		$scope.page.setTitle('Show Entity');
		$scope.editMode = false;

		$http.post('/entity/ngGetEntity/' + $stateParams.id)
		.then(function success(res) {
			$scope.entity = res.data;
			$scope.typeid = $scope.entity.type.id;
			$scope.countryid = $scope.entity.country.id;
			$scope.countryname = $scope.entity.country.name + ' - ' + $scope.entity.country.code;
			$scope.loadCountry();
		})
		.catch(function error(res) {
			$scope.entity = {};
			$scope.countryname = null;
			myToast.simpleToast(res.data, 'warn');
		});
	};
	//Get Entity Information On Page Load 
	$scope.showEntity();	

	$scope.editEntity = function() {
		$scope.page.setTitle('Edit Entity');
		$scope.editMode = true;
		myFocus.focusOn('entityid');
		$scope.entity.address += ' ';
		$timeout(function() {
			$scope.entity.address = $scope.entity.address.substr(0, $scope.entity.address.length-1);
		}, 100);
	};

	$scope.loadCountry = function() {
		$http.post('/country/ngGetCountries/')
		.then(function success(res) {
			$scope.countries = res.data;
			// console.log('loadUnit', $scope.countries);
		})	
		.catch(function error(res) {
			$scope.countries = null;
			myToast.simpleToast(res.data, 'warn');
		});	
  	};

  	$scope.selectCountry = function() {
  		if ($scope.countryid == null) {
  			$scope.entity.country = null;
  		}
  		else if ($scope.entity.country == null || $scope.countryid != $scope.entity.country.id) {
  			var countryObj = $scope.countries
	  		.filter(function(country) {
	  			return (country.id == $scope.countryid);
	  		})[0];
	  		$scope.entity.country = countryObj;
  		}
  	};

  	$scope.getCountryName = function() {
  		if ($scope.countryid != null) {
  			// console.log('getCountryName not null', $scope.countryid);
  			var countryObj = $scope.countries
	  		.filter(function(country) {
	  			return (country.id == $scope.countryid);
	  		})[0];
	  		$scope.countryname = countryObj.name + ' - ' + countryObj.code;
	  		return countryObj.name;
  		}
  		else {
  			// console.log('getCountryName is null', $scope.countryid);
  			$scope.countryname = null;
  			return 'Country';
  		}
  	};

  	$scope.selectType = function() {
  		if ($scope.typeid == null) {
  			$scope.entity.type = null;
  		}
  		else if ($scope.entity.type == null || $scope.typeid != $scope.entity.type) {
  			var typeObj = $scope.types
	  		.filter(function(type) {
	  			return (type.id == $scope.typeid);
	  		})[0];
	  		$scope.entity.type = typeObj;
  		}
  	};

	$scope.updateEntity = function() {
		var entityObj = {
			entityid: $scope.entity.entityid,
			type: $scope.entity.type.id,
			name: $scope.entity.name,
			fullname: $scope.entity.fullname,
			telno: $scope.entity.telno,
			email: $scope.entity.email,
			country: $scope.entity.country.id,
			address: $scope.entity.address
		};

		$http.post('/entity/ngUpdateEntity/' + $scope.entity.id, entityObj)
		.then(
			function success(res) {
				myToast.simpleToast('Entity information updated !','primary');
				$scope.showEntity();
			},
			function error(res) {
				myToast.simpleToast(res.data,'warn');
			}
		);
	};

	$scope.listEntity = function() {
		$state.go('entitylist');
	};

}])
//Entity List
.controller('EntityList', ['$scope', '$http', '$state', 'myToast', function($scope, $http, $state, myToast) {
	// $scope.auth = auth;

	$scope.loading = true;
	$scope.page.setTitle('Entity List');
	$scope.selected = [];
	$scope.limitOptions = [10,20,50,100];
	$scope.query = {
		filter: {}, //{ username: { 'contains': 'a' }, email: { contains: 'a' } }, 
		limit: 10,
		page: 1,
		order: ''
	};

	$scope.onReOrder = function(order) {
		$scope.loadEntityList();
	};

	$scope.onPagination = function(page, limit) {
		$scope.loadEntityList();
	};

	$scope.loadEntityList = function() {
		var p = {
			filter: $scope.query.filter,
	        limit: $scope.query.limit,
	        page: $scope.query.page,
	        order: $scope.query.order
		};
		$http({
	      url: '/entity/ngGetEntityList',
	      method: 'POST',
	      params: p
	    })
		.then(function success(res) {
			$scope.total = res.data.total;
			$scope.entities = res.data.entities;
		})	
		.catch(function error(res) {
			myToast.simpleToast(res.data, 'warn');
		})
		.finally(function () {
			$scope.loading = false;
		});
	};
	$scope.loadEntityList();

	$scope.showEntity = function(id) {
		if (id) {
			$state.go('entityshow', {id:id});
		}
	};

	$scope.newEntity = function() {
		$state.go('entitynew');
	};

}]);