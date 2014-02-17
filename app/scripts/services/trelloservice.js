'use strict';

var trelloObj = angular.module('trelloGanttApp')
.factory('Trelloservice', function Trelloservice($http, $q) {
	var TrelloserviceClient = {
		apiKey : '4c1e45a79e9f167d2565897fd7970674',
		/*
			SECURITY FUNCTIONS
		 */
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
		},
		/*
			END OF SECURITY FUNCTIONS
		 */
		/*
			MEMBER FUNCTIONS
		 */
		getBoards: function(){
			var defered = $q.defer();
			var token = this.getLocalToken();
			Trello.get('members/me/boards', {
				filter: 'open',
				token: token
			},function(data){
				defered.resolve(data);
			},function(error){
				console.error(error);
			});
			return defered.promise;
		}
	};
	return TrelloserviceClient;
});

trelloObj['$inject'] = ['$http', '$q'];
