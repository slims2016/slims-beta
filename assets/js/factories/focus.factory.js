angular.module('mainApp')
.factory('myFocus', ['$rootScope', '$timeout', (function($rootScope, $timeout) {
  	var service = {};

  	service.focusOn =  function(name) {
      return $timeout(function() {
        return $rootScope.$broadcast('focusOn', name);
      });
    };

    return service;

  })
]);