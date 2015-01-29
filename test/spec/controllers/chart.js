'use strict';

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var customDateEquality = function(first, second){
    if (first instanceof Date && second instanceof Date) {
         return first.toString() == second.toString();
    }
}

describe('Controller: ChartCtrl', function(){

    var createController,
    $rootScope,
    scope,
    $location,
    mockTrelloService  = {},
    mockGeneralSettings = {},
    mockModalProvider = {},
    isUserLogged = true,
    labels = {
            'red': '#E74C3C',
            'orange': '#E67E22',
            'yellow': '#F1C40F',
            'green': '#1ABC9C',
            'blue': '#3498DB',
            'purple': '#9B59B6'
        };

    beforeEach(module('trelloGanttApp.chart'));

    beforeEach(inject(function (_$rootScope_, $controller, _$location_, $q) {
        jasmine.addCustomEqualityTester(customDateEquality);

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
        mockTrelloService.updateCard = function(cardId){
            var defered = $q.defer();
            defered.resolve(cardId);
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

    //General tests start

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

    it('should get the right color for each label', function(){
        var controller = createController(null);
        for(var color in labels){
            expect(scope.getLabelColor(color)).toEqual(labels[color]);
        }
    });

    it('should get a default color for each color that was not predicted', function(){
        var expected = '#8C8C8C';
        var random = Math.random();
        createController(null);
        expect(scope.getLabelColor(null)).toEqual(expected);
        expect(scope.getLabelColor(' ' + random)).toEqual(expected);
        expect(scope.getLabelColor(random)).toEqual(expected);
    });

    //General tests end

    describe('Specific tests', function(){
        var random,
        randomDateGenerator = function (start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            },
        controller;

        beforeEach(function(){
            random = Math.random();
            $location.path('/chart/' + random);
            controller = createController(random);
        });

        //Gantt generation tests start

        describe('Build gantt data', function(){
            var cardList,
            taskDataExpected,
            getRandomLabel = function(){
                var min = 0;
                var max = labels.length;
                var index = Math.floor(Math.random() * (max-min)) + min;
                var foundKey;
                for(var label in labels){ index--; if(index < 0) foundKey = label;}
                return label;
            };

            beforeEach(function(){
                cardList = {name: '', cards: []};
                taskDataExpected = [];
            });

            it('should generate an empty task list data from an empty trello list', function(){
                var randomNumber = Math.random();
                cardList.name = '' + randomNumber;

                taskDataExpected = {
                    minStartDate: undefined,
                    maxEndDate: undefined,
                    data:[{name: '' + randomNumber}]
                };
                var taskDataGenerated = scope.buildTasksData(cardList);
                expect(taskDataGenerated).toEqual(taskDataExpected);
            });

            it('should generate task data from a trello list with one card without labels and no end date', function(){
                var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                var randomNumber = Math.random();
                var randomNumber2 = Math.random();

                cardList.name = '' + randomNumber;
                cardList.cards.push({
                    id: randomNumber,
                    due: randomDate,
                    name: '' + randomNumber2,
                    labels: []
                });

                var endDate = new Date(randomDate);
                endDate.setHours(23);
                endDate.setMinutes(59);

                var newStartDate = new Date(randomDate);
                newStartDate.setHours(0);
                newStartDate.setMinutes(0);

                taskDataExpected = {
                    minStartDate: newStartDate,
                    maxEndDate: endDate,
                    data: [
                        {name: '' + randomNumber},
                        {name: '' + randomNumber2, parent: '' + randomNumber, tasks:[
                            {
                                id: randomNumber,
                                name: '' + randomNumber2,
                                color: '#8C8C8C',
                                from: newStartDate,
                                to: endDate
                            }
                        ]}
                    ]};

                var taskDataGenerated = scope.buildTasksData(cardList);
                expect(taskDataGenerated).toEqual(taskDataExpected);
            });

            it('should generate task data from trello list with one card with one label and no end date', function(){
                var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                var randomNumber = Math.random();
                var randomNumber2 = Math.random();

                var randomLabel = getRandomLabel();

                cardList.name = '' + randomNumber;
                cardList.cards.push({
                    id: randomNumber,
                    due: randomDate,
                    name: '' + randomNumber2,
                    labels: [
                        {color: randomLabel}
                    ]
                });

                var endDate = new Date(randomDate);
                endDate.setHours(23);
                endDate.setMinutes(59);

                var newStartDate = new Date(randomDate);
                newStartDate.setHours(0);
                newStartDate.setMinutes(0);

                taskDataExpected = {
                    minStartDate: newStartDate,
                    maxEndDate: endDate,
                    data: [
                        {name: '' + randomNumber},
                        {name: '' + randomNumber2, parent: '' + randomNumber,  tasks:[
                            {
                                id: randomNumber,
                                name: '' + randomNumber2,
                                color: labels[randomLabel],
                                from: newStartDate,
                                to: endDate
                            }
                        ]}
                    ]};

                var taskDataGenerated = scope.buildTasksData(cardList);
                expect(taskDataGenerated).toEqual(taskDataExpected);
            });

            it('should generate the right data for a list with one card with multiple labels and no end date', function(){
                var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                var randomNumber = Math.random();
                var randomNumber2 = Math.random();

                var randomLabel = getRandomLabel();
                var randomLabels = [{color: randomLabel}];

                var randomLength = Math.floor(randomNumber * 10);

                for(var i = 0; i< (10* randomLength); i++){
                    randomLabels.push({color: getRandomLabel()});
                }

                cardList.name = '' + randomNumber;
                cardList.cards.push({
                    id: randomNumber,
                    due: randomDate,
                    name: '' + randomNumber2,
                    labels: randomLabels
                });

                var endDate = new Date(randomDate);
                endDate.setHours(23);
                endDate.setMinutes(59);

                var newStartDate = new Date(randomDate);
                newStartDate.setHours(0);
                newStartDate.setMinutes(0);

                taskDataExpected = {
                    minStartDate: newStartDate,
                    maxEndDate: endDate,
                    data: [
                        {name: '' + randomNumber},
                        {name: '' + randomNumber2, parent: '' + randomNumber,  tasks:[
                            {
                                id: randomNumber,
                                name: '' + randomNumber2,
                                color: labels[randomLabel],
                                from: newStartDate,
                                to: endDate
                            }
                        ]}
                    ]};

                var taskDataGenerated = scope.buildTasksData(cardList);
                expect(taskDataGenerated).toEqual(taskDataExpected);
            });

            it('should generate task data from a trello list with multiple cards without labels and no end date', function(){
                var randomNumber = Math.random();

                cardList.name = '' + randomNumber;
                taskDataExpected = [{name: '' + randomNumber}];

                var minStart,
                maxEnd;
                var randomCardLength = Math.floor(randomNumber * (10 - 1 + 1)) + 1;
                for(var i = 0; i<randomCardLength; i++){
                    var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                    var randomNumber2 = Math.random();
                    cardList.cards.push({
                        id: randomNumber,
                        due: randomDate,
                        name: '' + randomNumber2,
                        labels: []
                    });
                    var endDate = new Date(randomDate);
                    endDate.setHours(23);
                    endDate.setMinutes(59);

                    var newStartDate = new Date(randomDate);
                    newStartDate.setHours(0);
                    newStartDate.setMinutes(0);
                    taskDataExpected.push({name: '' + randomNumber2, parent: '' + randomNumber,
                                           tasks:[
                                               {
                                                   id: randomNumber,
                                                   name: '' + randomNumber2,
                                                   color: '#8C8C8C',
                                                   from: newStartDate,
                                                   to: endDate
                                               }
                                           ]});
                    if(!minStart || minStart > newStartDate)
                        minStart = newStartDate;
                    if(!maxEnd || maxEnd < endDate)
                        maxEnd = endDate;
                }

                taskDataExpected = {
                    minStartDate: minStart,
                    maxEndDate: maxEnd,
                    data: taskDataExpected
                };

                var taskDataGenerated = scope.buildTasksData(cardList);
                expect(taskDataGenerated.length).toEqual(taskDataExpected.length);
                expect(taskDataGenerated.minStartDate).toEqual(taskDataExpected.minStartDate);

            });

            it('should generate gantt data when passing just one list with cards', function(){
                var randomNumber = Math.random();

                cardList.name = '' + randomNumber;
                taskDataExpected = [{name: '' + randomNumber}];
                var minStartDate,
                maxEndDate;
                var randomCardLength = Math.floor(randomNumber * (10 - 1 + 1)) + 1;
                for(var i = 0; i<randomCardLength; i++){
                    var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                    var randomNumber2 = Math.random();
                    cardList.cards.push({
                        id: randomNumber,
                        due: randomDate,
                        name: '' + randomNumber2,
                        labels: []
                    });
                    var endDate = new Date(randomDate);
                    endDate.setHours(23);
                    endDate.setMinutes(59);
                    var newStartDate = new Date(randomDate);
                    newStartDate.setHours(0);
                    newStartDate.setMinutes(0);
                    taskDataExpected.push({name: '' + randomNumber2, parent: '' + randomNumber,
                                           tasks:[
                                               {
                                                   id: randomNumber,
                                                   name: '' + randomNumber2,
                                                   color: '#8C8C8C',
                                                   from: newStartDate,
                                                   to: endDate
                                               }
                                           ]});
                    if(!minStartDate || minStartDate > newStartDate)
                        minStartDate = newStartDate;
                    if(!maxEndDate || maxEndDate < endDate)
                        maxEndDate = endDate;
                }

                taskDataExpected = {
                    minStartDate: minStartDate,
                    maxEndDate: maxEndDate,
                    data: taskDataExpected
                };

                var taskDataGenerated = scope.buildGanttData([cardList]);
                expect(taskDataGenerated).toEqual(taskDataExpected);
            });

            it('should generate data for multiple Trello lists', function(){
                var randomNumber = Math.random();
                var randomListLength = Math.floor(randomNumber * 10) + 1;
                var lists = [];
                var minStartDate,
                maxEndDate;
                taskDataExpected = [];
                for(var j = 0; j < randomListLength; j++){
                    randomNumber = Math.random();
                    var tempCardList = {};
                    tempCardList.name = '' + randomNumber;
                    taskDataExpected.push({name: '' + randomNumber});
                    var randomCardLength = Math.floor(randomNumber * 10) + 1;
                    tempCardList.cards = [];
                    for(var i = 0; i<randomCardLength; i++){
                        var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                        var randomNumber2 = Math.random();
                        tempCardList.cards.push({
                            id: randomNumber,
                            due: randomDate,
                            name: '' + randomNumber2,
                            labels: []
                        });
                        var endDate = new Date(randomDate);
                        endDate.setHours(23);
                        endDate.setMinutes(59);

                        var newStartDate = new Date(randomDate);
                        newStartDate.setHours(0);
                        newStartDate.setMinutes(0);
                        taskDataExpected.push({name: '' + randomNumber2, parent: '' + randomNumber,
                                               tasks:[
                                                   {
                                                       id: randomNumber,
                                                       name: '' + randomNumber2,
                                                       color: '#8C8C8C',
                                                       from: newStartDate,
                                                       to: endDate
                                                   }
                                               ]});
                        if(!minStartDate || minStartDate > newStartDate)
                            minStartDate = newStartDate;
                        if(!maxEndDate || maxEndDate < endDate)
                            maxEndDate = endDate;
                    }
                    lists.push(tempCardList);
                }

                taskDataExpected = {
                    minStartDate : minStartDate,
                    maxEndDate : maxEndDate,
                    data: taskDataExpected
                }

                var taskDataGenerated = scope.buildGanttData(lists);
                expect(taskDataGenerated).toEqual(taskDataExpected);

            });

        });

        //Gantt generation tests end

        //Card actions in gantt tests start
        describe('Card actions in gantt', function(){
            it('should call TrelloService.updateCard', function(){
                var randomDate = randomDateGenerator(new Date(2012, 0, 1), new Date());
                var randomMomentDate = moment(randomDate);
                var randomNumber = Math.random();

                var mockTask = {
                    model: {
                        id: randomNumber,
                        from: randomMomentDate,
                        to: randomMomentDate
                    }
                };
                spyOn(mockTrelloService, 'updateCard').and.callThrough();
                scope.updateCard(mockTask);
                expect(mockTrelloService.updateCard).toHaveBeenCalledWith({
                    id: randomNumber,
                    due: randomDate
});
                expect(mockTrelloService.updateCard.calls.count()).toEqual(1);
            });
        });
        //Card actions in Gantt tests end
     });
});
