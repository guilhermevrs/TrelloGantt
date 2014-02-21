'use strict';

describe('Directive: gantt', function () {

  // load the directive's module
  beforeEach(module('trelloGanttApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gantt></gantt>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gantt directive');
  }));
});
