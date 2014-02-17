'use strict';

var trelloObj = angular.module('trelloGanttApp')
.factory('Trelloservice', function Trelloservice($http, $q) {
	var TrelloserviceClient = {
		apiKey : '4c1e45a79e9f167d2565897fd7970674',
		authorize : function(){
			var defered = $q.defer();
			var me = this;
			Trello.authorize({
				type : "popup",
				name : "TrelloGantt",
				success : function(data){
					defered.resolve(me.getLocalToken());
				},
				error: function(error){
					console.error(error);
				}
			});
			return defered.promise;
		},
		getLocalToken: function(){
			return localStorage.getItem('trello_token');
		},
		deauthorize: function(){
			Trello.deauthorize();
		}
	};
	return TrelloserviceClient;
});

trelloObj['$inject'] = ['$http', '$q'];
