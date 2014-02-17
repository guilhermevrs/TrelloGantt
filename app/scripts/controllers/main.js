'use strict';

var obj = angular.module('trelloGanttApp')
.controller('MainCtrl', function ($scope, Trelloservice, $rootScope, $location) {
	$scope.logme = function(){
		Trelloservice.authorize().then(function(data){
			$location.path("/chart");
		});
	}
	$rootScope.logout = function(){
		Trelloservice.deauthorize();
		$location.path("/");
	}
});

obj[ '$inject' ] = ['$scope', 'Trelloservice', '$rootScope', '$location'];
