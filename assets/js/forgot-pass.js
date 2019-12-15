var app = angular.module("sontn1309", []);
app.controller("ctrl1", function ($scope, $http) {
  $scope.Subjects = [];
  $scope.account = [];
  $scope.checkLogin = false;
  $scope.showMsg = false;
  $http.get("../assets/db/Students.JSON").then(function (response) {
    $scope.account = response.data.x;

    $scope.xmn = function () {
      $scope.user = document.getElementById("username").value;
      $scope.email = document.getElementById("email").value;
      angular.forEach($scope.account, function (item) {
        if ($scope.user == item.username && $scope.email == item.email) {
         
          Swal.fire(
           
            
            'Mật khẩu :' + item.password
           
          ).then(function () {
            window.location.assign("../pages/login-page.html");
          });
          
        }
      });
      $scope.showMsg = !$scope.checkLogin;
    }

  }, function (response) {
    alert("Lỗi kết nối tới máy chủ");
  });

});