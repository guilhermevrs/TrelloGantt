'use strict';

var obj = angular.module('trelloGanttApp')
.controller('MainCtrl', function ($scope, Trelloservice, $rootScope, $location, generalSettings) {
	/*SCOPE Functions*/
	$scope.logme = function(){
		Trelloservice.authorize().then(function(){
			$location.path('/boards');
		});
	}
	$rootScope.logout = function(){
		Trelloservice.deauthorize();
		$location.path('/');
	}
	$rootScope.getMenuClass = function(path){
		return ($location.path() === path);
	}
});

obj[ '$inject' ] = ['$scope', 'Trelloservice', '$rootScope', '$location', 'generalSettings'];
