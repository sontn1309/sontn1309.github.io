var x;
var app = angular.module("sontn1309", []);
app.controller("ctrl1", function ($scope, $http) {
    $scope.Subjects = [];
    $scope.Logout=function()
    {
        sessionStorage.clear();
    }
    $scope.Login = function () {
        x = sessionStorage.getItem('user');
        
        if(x!=null)
        {
            document.getElementById("username").innerHTML = x;
            return true;
        }else
        {
            return false;
        }

    }
    $http.get("../assets/db/Subjects.JSON").then(function (response) {
        $scope.Subjects = response.data.x;
    }, function (response) {
        alert("Erroor");
    });
});