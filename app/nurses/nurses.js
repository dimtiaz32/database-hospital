'use strict';

angular.module('myApp.NursesCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nurses', {
    templateUrl: 'nurses/nurses.html',
    controller: 'NursesCtrl'
  });
}])

.controller('NursesCtrl', [function() {

}]);
