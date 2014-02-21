'use strict';

var obj = angular.module('trelloGanttApp')
.controller('MainCtrl', function ($scope, Trelloservice, $rootScope, $location, generalSettings) {
	generalSettings.setBoardID(null);
	/*SCOPE Functions*/
	$scope.logme = function(){
		Trelloservice.authorize().then(function(data){
			$location.path("/boards");
		});
	}
	$rootScope.logout = function(){
		Trelloservice.deauthorize();
		$location.path("/");
	}
});

obj[ '$inject' ] = ['$scope', 'Trelloservice', '$rootScope', '$location', 'generalSettings'];
