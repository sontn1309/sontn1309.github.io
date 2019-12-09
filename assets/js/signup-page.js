var app = angular.module("sontn1309", []);
        var x=[];
        app.controller("ctrl1", function ($scope, $http) {
            $scope.Subjects = [];
            $scope.Students = [];
            $http.get("../assets/db/Students.JSON").then(function (response) {
                $scope.Students = response.data.x;
                x=response.data.x;    
            }, function (response) {
                alert("Erroor");
            }); 
            $http.get("../assets/db/Subjects.JSON").then(function (response) {
                $scope.Subjects = response.data.x;
            }, function (response) {
                alert("Erroor");
            });         
        });