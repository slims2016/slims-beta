angular.module('mainApp')
.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);  
                });
            });
        }
    }
}])
.directive('loginAuthDirective', [function() {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            //once Angular is started, remove class:
            elem.removeClass('waiting-for-angular');
            
            scope.$on('event:auth-loginRequired', function(event, data) {
                console.log('event:auth-loginRequired');
                console.log(data);
                scope.naviLogin();
            });
            scope.$on('event:auth-loginConfirmed', function(event, data) {
                //
            });
            scope.$on('event:auth-loginCancelled', function(event, data) {
                if (data == 'naviLogin') {
                    scope.naviLogin();    
                }
            });
            scope.$on('event:auth-forbidden', function(event, data) {
                if (data.data == 'CSRF mismatch') {
                    delete data.data;
                    scope.naviLogin();
                }
            });
        }
    }
}])
.directive('autoFocusOn', [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.$watch(attrs.autoFocusOn, function(value) {
                // console.log('value =',value);
                // if(value === true) { 
                elem[0].focus();
                if (elem[0].hasAttribute('auto-focus-on')) {
                    // console.log('hasAttribute');
                    elem[0].removeAttribute('auto-focus-on');    
                }
                if (elem[0].hasAttribute('auto-focus-on')) {
                    // console.log('hasAttribute');
                    elem[0].removeAttribute('auto-focus-on');    
                }
                else {
                    // console.log('removeAttribute');
                }
                // console.log('after');
                // console.log(elem[0]);
                // scope[attrs.autoFocusOn] = false;
                // }
            });
        }
    }
}])
.directive('focusOn', [function() {
  return function(scope, elem, attr) {
    return scope.$on('focusOn', function(e, name) {
      if (name === attr.focusOn) {
        return elem[0].focus();
      }
    });
  };
}]);