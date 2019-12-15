var app = angular.module("sontn1309", []);
app.controller("login-page-ctrl", function ($scope, $http) {
  $scope.Subjects = [];
  $scope.account = [];
  $scope.checkLogin = false;
  $scope.showMsg = false;
  $http.get("../assets/db/Students.JSON").then(function (response) {
    $scope.account = response.data.x;

    $scope.xmn = function () {
      $scope.user = document.getElementById("username").value;
      $scope.pass = document.getElementById("password").value;
      angular.forEach($scope.account, function (item) {
        if ($scope.user == item.username && $scope.pass == item.password) {
          sessionStorage.setItem('user', $scope.user);
          $scope.checkLogin = true;
          Swal.fire({
           
            icon: 'success',
            title: 'Đăng nhập thành công',
            showConfirmButton: false,
            timer: 1500
          }).then(function () {
            window.location.assign("../index.html");
          });
          
        }
      });
      $scope.showMsg = !$scope.checkLogin;
    }

  }, function (response) {
    alert("Lỗi kết nối tới máy chủ");
  });
  $http.get("../assets/db/Subjects.JSON").then(function (response) {
    $scope.Subjects = response.data.x;
  }, function (response) {
    alert("Lỗi kết nối tới máy chủ");
  });
});