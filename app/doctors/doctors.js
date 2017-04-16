'use strict';

angular.module('myApp.DoctorsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/doctors', {
    templateUrl: 'doctors/doctors.html',
    controller: 'DoctorsCtrl'
  });
}])

.controller('DoctorsCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.doctors = [];

  $http.get(SERVER_HOST + '/api/doctors')
    .then(function(response){
      $scope.doctors = response.data.data;
      console.log($scope.doctors);
      console.log($scope.doctors);
    },
    function(error){
      console.log("ERROR: " + error);
    });


  $scope.doctorSelected = function(did) {
    console.log(did + " SELECTED");
  }

}]);
