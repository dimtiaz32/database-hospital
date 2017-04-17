'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.PatientsCtrl',
  'myApp.DoctorsCtrl',
  'myApp.NursesCtrl',
  'myApp.version',
  'ngMaterial'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/patients'});
}]);
