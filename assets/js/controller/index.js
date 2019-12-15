
var app = angular.module("sontn1309", []);
app.controller("index-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    $scope.showQuiz;
    $scope.Logout=function()
    {
        sessionStorage.clear();
    }
    $scope.Login = function () {
       var x = sessionStorage.getItem('user');
        
        if(x!=null)
        {
            document.getElementById("username").innerHTML = x;
            return true;
        }else
        {
            return false;
        }

    }
    $http.get("assets/db/Subjects.JSON").then(function (response) {
        $scope.Subjects = response.data.x;
        $scope.showQuiz=function(subjectId,subjectName){
            sessionStorage.setItem('subjectId',subjectId);
            sessionStorage.setItem('subjectName',subjectName);
            window.location.assign("../pages/quiz.html");
          

        }
    }, function (response) {
        alert("Erroor");
    });
});