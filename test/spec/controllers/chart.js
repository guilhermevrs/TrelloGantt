'use strict';

describe('Controller: ChartCtrl', function(){

    var createController,
    $rootScope,
    scope,
    $location,
    mockTrelloService  = {},
    mockGeneralSettings = {},
    mockModalProvider = {},
    isUserLogged = true;

    beforeEach(module('trelloGanttApp.chart'));

    beforeEach(inject(function (_$rootScope_, $controller, _$location_, $q) {
        mockTrelloService.isUserLogged = function(){
            return isUserLogged;
        };
        mockTrelloService.getBoardInfo = function(boardID){
            var defered = $q.defer();
            defered.resolve(boardID);
            return defered.promise;
        };
        isUserLogged = true;

        mockGeneralSettings.setMemberCache = function(boardID){
            //NOT YET IMPLEMENTED
        };

        $rootScope = _$rootScope_;

        $location = _$location_;
        scope = $rootScope.$new();
        createController = function(boardID) {
            var routeParam = {boardID: boardID};
            return $controller('ChartCtrl', {
                '$scope': scope,
                'Trelloservice': mockTrelloService,
                'generalSettings': mockGeneralSettings,
                '$modal': mockModalProvider,
                '$location': $location,
                '$routeParams': routeParam
            });
        };
    }));

    it('should redirect to / when user is not logged and boardID is defined', function(){
        isUserLogged = false;
        var random = Math.random();
        $location.path('/chart/' + random);
        var controller = createController(random);
        expect($location.path()).toBe('/');
    });

    it('should not redirect when user is logged and boardID is defined', function(){
        var random = Math.random();
        $location.path('/chart/' + random);
        var controller = createController(random);
        expect($location.path()).toBe('/chart/' + random);
    });

    it('should redirect to / when boardID not defined', function(){
        $location.path('/chart/');
        var controller = createController(null);
        expect($location.path()).toBe('/');
    });
});
