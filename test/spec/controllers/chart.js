'use strict';

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

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
        isUserLogged = true;
        mockTrelloService.isUserLogged = function(){
            return isUserLogged;
        };
        mockTrelloService.getBoardInfo = function(boardID){
            var defered = $q.defer();
            defered.resolve(boardID);
            return defered.promise;
        };
        mockTrelloService.getCardsFromBoard = function(boardID){
            var defered = $q.defer();
            defered.resolve(boardID);
            return defered.promise;
        };

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

    describe('Build gantt task data', function(){
        var random,
        cardList = {name: '', cards: []},
        taskDataExpected = [],
        randomDateGenerator = function (start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        },
        controller;

        beforeEach(function(){
            random = Math.random();
            $location.path('/chart/' + random);
            controller = createController(random);
        });

        it('should generate an empty task list data from an empty trello list', function(){
            var randomNumber = Math.random();
            cardList.name = '' + randomNumber;

            taskDataExpected = [{name: '' + randomNumber}];
            var taskDataGenerated = scope.buildTasksData(cardList);
            expect(taskDataGenerated).toEqual(taskDataExpected);
        });

        it('should generate task data from a trello list with one card without labels', function(){
            var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
            var randomNumber = Math.random();
            var randomNumber2 = Math.random();

            cardList.name = '' + randomNumber;
            cardList.cards.push({
                due: randomDate,
                name: '' + randomNumber2,
                labels: []
            });

            taskDataExpected = [
                {name: '' + randomNumber},
                {name: '' + randomNumber2, parent: '' + randomNumber, tasks:[
                    {
                        name: '' + randomNumber2,
                        color: '#95a5a6',
                        from: randomDate,
                        to: randomDate + 1
                    }
                ]}
            ];

            var taskDataGenerated = scope.buildTasksData(cardList);
            expect(taskDataGenerated).toEqual(taskDataExpected);
        });

    });
});
