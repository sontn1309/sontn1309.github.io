var app = angular.module("sontn1309", []);
    
        app.controller("signup-page-ctrl", function ($scope, $http) {
            $scope.Subjects = [];
            $scope.Students = [];
           
            $scope.a=function(){
                Swal.fire(
                    'Chúc mừng!',
                    'Bạn đã đăng kí thành viên thành công',
                    'success'
                  ).then(function(){
                    window.location.assign("../index.html");
                  }
                  )

            }
            $http.get("../assets/db/Students.JSON").then(function (response) {
                $scope.Students = response.data.x;
              
            }, function (response) {
                alert("Erroor");
            }); 
            $http.get("../assets/db/Subjects.JSON").then(function (response) {
                $scope.Subjects = response.data.x;
            }, function (response) {
                alert("Erroor");
            });         
        });