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
					scope: { read: true, write: true, account: false },
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
			isUserLogged: function(){
				return this.getLocalToken() !== null;
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
			},
			getOrganization: function(){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('members/me/organizations', {
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
			getBoardInfo: function(boardID){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('boards/'+boardID, {
					token: token
				}, function(data){
					defered.resolve(data);
				}, function(error){
					console.error(error);
				});
				return defered.promise;
			},
		/*
			END OF MEMBER FUNCTIONS
			*/
		/*
			BOARDS FUNCTIONS
			*/
			getCardsFromBoard: function(boardID){
				var defered = $q.defer();
				var token = this.getLocalToken();
				Trello.get('boards/'+boardID+'/lists/', {
					cards:"open",
					card_fields: "due,idList,idMembers,labels,name",
					filter:"open",
					fields: "name",
					token: token
				},function(data){
					defered.resolve(data);
				},function(error){
					console.error(error);
				});
				return defered.promise;
			},
		/*
			END BOARDS FUNCTIONS
			*/
			/*
			CARD FUNCTIONS
			 */
			updateCard: function(card){
				var defered = $q.defer();
				Trello.put('cards/'+card.name, {
					name: "NOME",
					due: new Date()
				}, function(data){
					defered.resolve(data);
				}, function(error){
					console.error(error);
				});
				return defered.promise;
			}
			/*
			END CARD FUNCTIONS
			 */
		};
		return TrelloserviceClient;
	});

trelloObj['$inject'] = ['$http', '$q'];
