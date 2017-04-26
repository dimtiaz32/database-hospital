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
  //variables for the controller
  $scope.doctors = [];
  $scope.selectedDoctor = {};
  $scope.newDoctor = {
    fname: 'John',
    lname: 'Smith',
    specialty: 'None'
  };
  $scope.doctorPatients = [];
  $scope.newSpecialty = "Add Specialty";


  //Filter Stuff
  $scope.specialties = [];
  $scope.selectedSpecialty = {};

  //Search Stuff
  $scope.fnameSearch;
  $scope.lnameSearch;

  //load functions
  $scope.loadDoctors = function() {
    $http.get(HOST + '/api/doctors')
      .then(function(response){
        $scope.doctors = response.data.data;
        $scope.selectedDoctor = $scope.doctors[0];
        //console.log($scope.selectedDoctor);
        $scope.selectDoctor($scope.selectedDoctor);
      },
      function(error){
        console.log(error);
      });
  }

  //this selects a doctor for the doctor detail view
  $scope.selectDoctor = function(doctor) {
    $scope.selectedDoctor = doctor;

    //get the specialties for the doctor
    $http.get(HOST + '/api/specialties/' + doctor.did)
      .then(function(response) {
        var specialties = [];
        var resArray = response.data.data;
        for (var i = 0; i < resArray.length; i++) {
          specialties.push(resArray[i].specialty);
        }
        $scope.selectedDoctor.specialties = specialties;
        //console.log($scope.selectedDoctor.specialties);
        //console.log("GOT THE SPECIALTIES");
      },
      function(error) {
        console.log(error);
      });

    //get the patients for the doctors
    $http.post(HOST + '/api/filteredPatients', {
      did: doctor.did,
      wid: 0
    })
      .then(function(response) {
        $scope.doctorPatients = response.data.data;
        //console.log("PATIENTS: " + $scope.doctorPatients);
      },
      function(error) {
        console.log(error);
      });
  }

  //post a new doctor
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


  //query database for filtered doctors
  $scope.filterDoctors = function() {
    $http.post(HOST + '/api/filteredDoctors', {
      specialty: $scope.selectedSpecialty.specialty
    })
      .then(function(response) {
        //console.log(response.data.data);
        $scope.doctors = response.data.data;
      },
      function(error) {
        console.log(error);
      });
  }

  //query to search for doctors
  $scope.searchDoctors = function() {
    $http.post(HOST + '/api/searchDoctors', {
      fnamesearch: $scope.fnameSearch,
      lnamesearch: $scope.lnameSearch
    })
      .then(function(response) {
        $scope.doctors = response.data.data;
      }, function(error) {
        console.log(error);
      });
  }

  //get the possible specialties
  $scope.loadSpecialties = function() {
    $http.get(HOST + '/api/specialties')
      .then(function(response) {
        $scope.specialties = response.data.data;
        $scope.specialties.push({ did: 0, specialty: 'None' });
      },
      function(error) {
        console.log(error);
      });
  }

  //add a specialty for a doctor
  $scope.addSpecialty = function(doctor) {
    $http.post(HOST + '/api/specialties', {
      did: doctor.did,
      specialty: $scope.newSpecialty
    })
      .then(function(response) {
        console.log(response);
        $scope.selectDoctor(doctor);
      }, function(error) {
        console.log(error);
      });
  }

  //Functions to call on startup
  $scope.loadDoctors();
  $scope.loadSpecialties();

}]);
