'use strict';

describe('Controller: ChartCtrl', function(){

    var createController,
    $rootScope,
    scope,
    $location,
    mockTrelloService  = {},
    isUserLogged = true;

    beforeEach(module('trelloGanttApp.chart'));

    beforeEach(inject(function (_$rootScope_, $controller, _$location_, $q) {
        mockTrelloService.isUserLogged = function(){
            return isUserLogged;
        };
        mockTrelloService.getBoardInfo = function(boardID){
            //NOT YET IMPLEMENTED
        };

        isUserLogged = true;

        $rootScope = _$rootScope_;

        $location = _$location_;
        scope = $rootScope.$new();
        createController = function() {
            return $controller('ChartCtrl', {
                '$scope': scope,
                'Trelloservice': mockTrelloService,
                '$location': $location
            });
        };
    }));

    it('should redirect to / when user is not logged and boardID is defined', function(){
        isUserLogged = false;
        var random = Math.random();
        $location.path('/chart/' + random);
        var controller = createController();
        expect($location.path()).toBe('/');
    });

    it('should not redirect when user is logged and boardID is defined', function(){
        var random = Math.random();
        $location.path('/chart/' + random);
        var controller = createController();
        expect($location.path()).toBe('/' + random);
    });

    it('should redirect to / when boardID not defined', function(){
        $location.path('/chart/');
        var controller = createController();
        expect($location.path()).toBe('/');
    });
});
