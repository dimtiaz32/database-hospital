'use strict';

angular.module('myApp.DoctorsCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/doctors', {
    templateUrl: 'doctors/doctors.html',
    controller: 'DoctorsCtrl'
  });
}])

.controller('DoctorsCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var HOST = 'http://localhost:3000';

  $scope.doctors = [];
  $scope.selectedDoctor = {};
  $scope.newDoctor = {
    fname: 'John',
    lname: 'Smith',
    specialty: 'None'
  };
  $scope.doctorPatients = [];


  //load functions
  $scope.loadDoctors = function() {
    $http.get(HOST + '/api/doctors')
      .then(function(response){
        $scope.doctors = response.data.data;
        $scope.selectedDoctor = $scope.doctors[0];
        console.log($scope.selectedDoctor);
        $scope.selectDoctor($scope.selectedDoctor);
      },
      function(error){
        console.log(error);
      });
  }

  $scope.selectDoctor = function(doctor) {
    $scope.selectedDoctor = doctor;

    //get the specialties for the doctor
    $http.get(HOST + '/api/doctorSpecialties/' + doctor.did)
      .then(function(response) {
        var specialties = [];
        var resArray = response.data.data;
        for (var i = 0; i < resArray.length; i++) {
          specialties.push(resArray[i].specialty);
        }
        $scope.selectedDoctor.specialties = specialties;
        //console.log($scope.selectedDoctor.specialties);
        console.log("GOT THE SPECIALTIES");
      },
      function(error) {
        console.log(error);
      });
    console.log($scope.selectedDoctor);

    //get the patients for the doctors
    $http.post(HOST + '/api/filteredPatients', {
      did: doctor.did,
      wid: 0
    })
      .then(function(response) {
        $scope.doctorPatients = response.data.data;
        console.log("PATIENTS: " + $scope.doctorPatients);
      },
      function(error) {
        console.log(error);
      });
  }

  $scope.addDoctor = function() {
    $http.post("http://localhost:3000/api/doctors",{
      fname: $scope.newDoctor.fname,
      lname: $scope.newDoctor.lname,
      specialty: $scope.newDoctor.specialty
    },{
      method: "POST"
    })
      .then(function(response) {
        console.log('Doctor successflly created');
        console.log(response);
        $scope.loadDoctors();
      },
      function(error) {
        console.log("ERROR OCCURRED");
        console.log(error);
      });
  }

  //Functions to call on startup
  $scope.loadDoctors();

}]);
