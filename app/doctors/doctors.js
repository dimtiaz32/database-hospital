'use strict';

angular.module('myApp.DoctorsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/doctors', {
    templateUrl: 'doctors/doctors.html',
    controller: 'DoctorsCtrl'
  });
}])

.controller('DoctorsCtrl', ['$scope', '$http', function($scope, $http) {

  var SERVER_HOST = 'http://localhost:3000';

  $scope.doctors = [];
  $scope.selecteDoctor = {};
  $scope.newDoctor = {
    fname: 'John',
    lname: 'Doe',
    phonenumber: '1234567890',
    pdetails: 'No details'
  };


  //load functions
  $scope.loadDoctors = function() {
    $http.get(SERVER_HOST + '/api/doctors')
      .then(function(response){
        $scope.doctors = response.data.data;
        $scope.selectedDoctor = $scope.doctors[0];
      },
      function(error){
        console.log("ERROR: " + error);
      });
  }

  $scope.selectDoctor = function(doctor) {
    $scope.selectedDoctor = doctor;

    //get the specialties for the doctor
    $http.get(SERVER_HOST + '/api/doctorSpecialties/' + doctor.did)
      .then(function(response) {
        var specialties = [];
        var resArray = response.data.data;
        for (var i = 0; i < resArray.length; i++) {
          specialties.push(resArray[i].specialty);
        }
        $scope.selectedDoctor.specialties = specialties;
        console.log($scope.selectedDoctor.specialties);
      })
      .catch(function(error) {
        console.log("ERROR" + error);
      });
    console.log($scope.selectedDoctor);
  }

  //Functions to call on startup
  $scope.loadDoctors();

}]);
