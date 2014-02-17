'use strict';

var obj = angular.module('trelloGanttApp')
.controller('MainCtrl', function ($scope, Trelloservice, $rootScope) {
	$scope.logme = function(){
		Trelloservice.authorize().then(function(data){
			console.log(data);
		});
	}
	$rootScope.logout = function(){
		Trelloservice.deauthorize();
	}
});

obj[ '$inject' ] = ['$scope', 'Trelloservice', '$rootScope'];
