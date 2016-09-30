angular.module('mainApp')
.factory('UserSession', ['$q', '$http', '$resource', 'authService', function($q, $http, $resource, authService) {
    
    var service = {};
    var _user = undefined;
    var _auth = false;
    var _csrf = undefined;

    service.rootUser = function() {
        return _user;
    };

    service.rootAuth = function() {
        return _auth;
    };

    service.csrfToken = function(callback) {
        $resource('/csrftoken').get(function(res) {
            _csrf = res._csrf;
            $http.defaults.headers.common['X-CSRF-Token'] = _csrf;
            if (typeof callback === 'function') {
                callback(_csrf);    
            }
        });
    };

    // service.csrfToken = function() {

    //     // console.log('service.csrfToken');
    //     var deferred = $q.defer();

    //     $http.get('/csrftoken')
    //     .then(function(res) {
    //         $http.defaults.headers.common['X-CSRF-Token'] = res.data._csrf;
    //         deferred.resolve(res.data._csrf);
    //     })
    //     .catch(function() {
    //         $http.defaults.headers.common['X-CSRF-Token'] = undefined;
    //         deferred.resolve(undefined);
    //     });

    //     return deferred.promise;

    // };

    service.getUser = function(callback) {
        $http.put('/session/ngGetSession', {Session: 'ngGetSession'})
        .then(function(res) {
            var session = res.data;
            if (session.user) {
                _user = session.user;
            }
            else {
                _user = undefined;
            }
            if (typeof callback === 'function') {
                callback(_user);    
            }
        })
        .catch(function (res) {
            _user = undefined;
            if (typeof callback === 'function') {
                callback(_user);    
            }
        });
    }

    // service.getUser = function(callback) {
    //     $http.put('/session/ngGetSession', {Session: 'ngGetSession'})
    //     .then(function(res) {
    //         var session = res.data;
    //         if (session.user) {
    //             _user = session.user;
    //             callback(_user);
    //         }
    //         else {
    //             _user = undefined;
    //             callback(_user);
    //         }
    //     })
    //     .catch(function (res) {
    //         _user = undefined;
    //         callback(_user);
    //     });
    // }

    // service.getUser = function() {

    //     var deferred = $q.defer();

    //     $http.put('/session/ngGetSession', {
    //         Session: 'ngGetSession'
    //     })
    //     .then(function(res) {
    //         var session = res.data;
    //         if (session.user) {
    //             _user = session.user;
    //             deferred.resolve(_user);
    //         }
    //         else {
    //             _user = undefined;
    //             deferred.reject(_user);
    //         }
    //     })
    //     .catch(function () {
    //         _user = undefined;
    //         deferred.reject(_user);
    //     });
        
    //     return deferred.promise;
        
    // };

    var testLoginConfirmed = function() {
        console.log('loginConfirmed');
        authService.loginConfirmed();
    };

    var testLoginCancelled = function() {
        console.log('loginCancelled');
        authService.loginCancelled();
    };  

    service.getAuth = function(callback, forceLogin) {
        $http.put('/session/ngGetSession', {Session: 'ngGetSession'})
        .then(function(res) {
            var session = res.data;
            if (session.user) {
                _user = session.user;
            }
            else {
                _user = undefined;
                
            }
            _auth = _user != undefined;
            //activate login dialog
            if (!_auth && !!forceLogin) {
                authService.loginCancelled('naviLogin');
            }
            if (typeof callback === 'function') {
                callback(_auth);    
            }
        })
        .catch(function () {
            _user = undefined;
            _auth = false;
            //activate login dialog
            if (!!forceLogin) {
                authService.loginCancelled('naviLogin');
            }
            if (typeof callback === 'function') {
                callback(_auth);    
            }
        });
    };    

    service.loginUser = function(user, pass) {

        var deferred = $q.defer();

        $http.put('/session/ngLoginUser', {
        username: user,
        password: pass
        })
        .then(function(res) {
            if (res.data) {
                _user = res.data;
                deferred.resolve(_user);
            }
            else {
                _user = undefined;
                deferred.reject('_user = undefined');
            }
        })
        .catch(function error(res) {
            _user = undefined;
            deferred.reject(res);
        });

        return deferred.promise;

    };

    service.logoutUser = function() {
        var deferred = $q.defer();

        $http.get('/session/ngLogoutUser')
        .then(function(res) {
            deferred.resolve(res.data);
        })
        .catch(function () {
            deferred.reject('error');
        })
        .finally(function() {
            _user = undefined;
        });
        
        return deferred.promise;

    };

    return service;
}]);