angular.module('mainApp')
.factory('myToast', ['$mdToast', function($mdToast) {

	var service = {};
	// mdToast section
	var tPos = {
		bottom: false,
		top: true,
		left: true,
		right: false
	};

	var toastPosition = angular.extend({},tPos);
	var getToastPosition = function() {
		return Object.keys(toastPosition)
			.filter(function(pos) { return toastPosition[pos]; })
			.join(' ');
	};

	service.simpleToast = function(msg, theme) {
		if (!msg) return;
		//theme: primary, warn, accent
		//main.module.js -> app.config -> $mdThemingProvider

		//parent: #main-view
		//layout.ejs -> <md-content id="main-view">
		var pinTo = getToastPosition();
		$mdToast.show(
		  $mdToast.simple()
		  	.parent('#main-view')
			.textContent(msg)
			.position(pinTo)
			.theme(theme)
			.hideDelay(3000)
		);
	};

	return service;
}]);