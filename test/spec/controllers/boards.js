'use strict';

describe('Controller: BoardsCtrl', function(){

    var createController,
    $rootScope,
    scope,
    $location,
    mockTrelloService  = {},
    isUserLogged = true,
    mockOrganizations,
    mockBoards;

    beforeEach(module('trelloGanttApp.board'));

    beforeEach(inject(function (_$rootScope_, $controller, _$location_, $q) {
        mockTrelloService.isUserLogged = function(){
            return isUserLogged;
        };
        mockTrelloService.getOrganizations = function(){
            var defered = $q.defer();
            defered.resolve(mockOrganizations);
            return defered.promise;
        };
        mockTrelloService.getBoards = function(){
            var defered = $q.defer();
            defered.resolve(mockBoards);
            return defered.promise;
        };

        isUserLogged = true;

        $rootScope = _$rootScope_;

        $location = _$location_;
        scope = $rootScope.$new();
        createController = function() {
            return $controller('BoardsCtrl', {
                '$scope': scope,
                'Trelloservice': mockTrelloService,
                '$location': $location
            });
        };
    }));

    it('should redirect to / when user is not logged', function(){
        isUserLogged = false;
        $location.path('/boards');
        var controller = createController();
        expect($location.path()).toBe('/');
    });

    it('should not redirect when user is logged', function(){
        $location.path('/boards');
        var controller = createController();
        expect($location.path()).toBe('/boards');
    });

    it('should save organizations', function(){
        mockOrganizations = Math.random();
        createController();
        $rootScope.$digest();
        expect(scope.organizations).toBe(mockOrganizations);
    });

    it('should save boards', function(){
        mockBoards = Math.random();
        createController();
        $rootScope.$digest();
        expect(scope.boards).toBe(mockBoards);
    });

    it('should redirect to the chart url', function(){
        createController();
        var boardID = Math.random();
        scope.seeBoardChart(boardID);
        expect($location.path()).toBe('/chart/'+boardID);
    });
});
