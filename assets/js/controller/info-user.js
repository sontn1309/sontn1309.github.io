 var app = angular.module("sontn1309", []);
        app.controller("info-user-ctrl", function ($scope, $http) {
            $scope.Subjects = [];
          
            $scope.Logout = function () {
                sessionStorage.clear();
            }
            $scope.Login = function () {
                x = sessionStorage.getItem('user');

                if (x != null) {
                    document.getElementById("username").innerHTML = x;
                    return true;
                } else {
                    return false;
                }

            }
            $http.get("../assets/db/Students.JSON").then(function (response) {
                $scope.user = [];
                $scope.account=response.data.x;
                angular.forEach($scope.account, function (item) {
                    if (x == item.username) {

                        $scope.user =angular.copy(item);
                      
                    }
                });
             
                

            }, function (response) {
                alert("Lỗi kết nối tới máy chủ");
            });
            $http.get("../assets/db/Subjects.JSON").then(function (response) {
                $scope.Subjects = response.data.x;
            }, function (response) {
                alert("Erroor");
            });
        });