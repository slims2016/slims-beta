var app = angular
  .module('mainApp', [
    'ngMaterial', 
    'ngMessages', 
    'ngResource',
    'ui.router', 
    'md.data.table', 
    'fixed.table.header',
    'permission',
    'permission.ui',
    'webStorageModule',
    'http-auth-interceptor'
  ]);

app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.theme('primary');
	$mdThemingProvider.theme('warn');
	$mdThemingProvider.theme('accent');
}]);

// angular.module('mainApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'md.data.table', 'fixed.table.header'])
// .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
// 	$routeProvider
// 		.when('/user/new', {
// 			templateUrl: "templates/user/new.html",
// 			controller: "UserNew"
// 		})
// 		.when('/user/list', {
// 			templateUrl: "templates/user/list.html",
// 			controller: "UserList"
// 		})
// 		.when('/user/login', {
// 			templateUrl: 'templates/user/login.html',
// 			controller: "UserLogin"
// 		})
// 		.when('/user/:id', {
// 			templateUrl: "templates/user/show.html",
// 			controller: "UserShow"
// 		})
// }]);

// angular.module('mainApp').run(['$http', function($http) {
//   if (window.SAILS_LOCALS._csrf) {
//     $http.defaults.headers.common['X-CSRF-Token'] = window.SAILS_LOCALS._csrf;
//   }
// }]);

// app.value('userAuth', {
//     user: undefined,
//     roles: []
// });

app.run(['$rootScope', '$http', '$state', 'PermRoleStore', 'UserSession', 'authService', 
    function($rootScope, $http, $state, PermRoleStore, UserSession, authService) {

    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' @ S.L.I.M.S.';
        }
    }

    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // track the state the user wants to go to; 
        // authorization service needs this
        // $rootScope.toState = toState;
        // $rootScope.toStateParams = toStateParams;
        // if the principal is resolved, do an 
        // authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        // console.log('toState');
        // console.log(!!toState.public);
        // UserSession.getAuth();
        // .catch(function() {
        //     authService.loginCancelled();
        // });

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toStateParams) {

        // console.log('stateChangeSuccess');
        // console.log(toState);

    });

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        // console.log('routeChangeSuccess');
        // console.log(current);
    });
    $rootScope.$on('$locationChangeSuccess', function(event, current, previous) {
        //hash(#) url is private page
        $rootScope.isPrivatePage = current.indexOf('/#/') > 0;
        $rootScope.isHomePage = (current.substr(current.length-3,3) == '/#/');
        // $rootScope.isPrivatePage = current.indexOf('icons') > 0;
        // console.log('locationChangeSuccess: ' + current);
        // console.log(current.substr(current.length-3,3));
        // console.log('isHomePage: ' + $rootScope.isHomePage);
        // console.log('isPrivatePage: ' + $rootScope.isPrivatePage);
        
        // $rootScope.page.setTitle(current.$$route.title || 'Welcome');
    });

    // if (window.SAILS_LOCALS._csrf) {
    // 	 $http.defaults.headers.common['X-CSRF-Token'] = window.SAILS_LOCALS._csrf;
    // }

    UserSession.csrfToken(function(_csrf) {
        UserSession.getUser(function(user) {
            $rootScope.rootUser = user;
        });
        UserSession.getAuth(function(auth) {
            $rootScope.rootAuth = auth;
        });
    });

    // UserSession.csrfToken()
    // .then(function(csrf) {
    //     UserSession.getAuth()
    //     .then(function (isAuth) {
    //         // console.log('isAuth');
    //         // console.log(isAuth);
    //     });

    //     UserSession.getUser()
    //     .then(function (user) {
    //         $rootScope.rootUser = user;
    //         $rootScope.rootAuth = user != undefined;
    //         // console.log($rootScope.rootUser);
    //         // console.log($rootScope.rootAuth);
    //     });
    // });

    
    // $rootScope.rootUser = UserSession.getUser();
    // $rootScope.rootAuth = UserSession.isAuthenticated();
    // console.log($rootScope.rootUser);
    // console.log('UserSession.isAuthenticated()');
    // console.log($rootScope.rootAuth);

    // PermRoleStore.defineRole('AUTHORIZED', function() {
    //     // return userAuth.user !== undefined;
    //     return UserSession.getAuth();
    // });

}]);

// myApp.run(['$rootScope', function($rootScope) {
//     $rootScope.page = {
//         setTitle: function(title) {
//             this.title = title + ' | Site Name';
//         }
//     }

//     $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
//         $rootScope.page.setTitle(current.$$route.title || 'Default Title');
//     });
// }]);