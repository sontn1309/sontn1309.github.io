var stop; // Biên stop cho việc ngừng đếm ngược
var app = angular.module("sontn1309", []); //khai báo app có tên sontn1309
app.controller("ctrl1", function ($scope, $http, $interval, $rootScope) {
  $scope.Subjects = []; // Khi báo biến dữ liệu các môn học
  $scope.quizs = []; // khai báo biến chứa dữ liệu quiz
  $scope.numberQuiz = 0; // Biến thể hiện vị trí câu hỏi 
  $scope.timerCount = 900; // thời gian làm bài(giây)
  $scope.minutesTimerCount = 0; // thời gian làm bài (phút)
  $scope.secondsTimerCount = 0; // thời gian làm bài (giây)
  $scope.viewMode = false;
  $scope.view = "Show full";
  $rootScope.mark = 0;
  $scope.disabledprev = true;
  $scope.disablednext = false;
  $scope.disabledInput = false;
  $scope.setViewMode = function () {
    if ($scope.viewMode) {
      $scope.view = "Show full";
      $scope.viewMode = false;
    } else {
      $scope.view = "Show one";
      $scope.viewMode = true;
    }
  }
  //function thực hiện reset lại thời gian lamg bài
  $scope.resetTime = function () {
    $rootScope.mark = 0;
    $scope.disabledInput = false;
    for (var i = 0; i < 9; i++) {
      document.getElementById($scope.quizs[i].AnswerId).classList.remove("text-success");
      document.getElementById($scope.quizs[i].AnswerId).classList.remove("fas");
      document.getElementById($scope.quizs[i].AnswerId).classList.remove("fa-check-circle");
      if ($scope.quizs[i].useranser != null) {
        document.getElementById($scope.quizs[i].useranser).classList.remove("text-danger");
        document.getElementById($scope.quizs[i].useranser).classList.remove("fas");
        document.getElementById($scope.quizs[i].useranser).classList.remove("fa-times-circle");
      }
      $scope.quizs[i].useranser = "";
    }
    for (var i = 0; i < 9; i++) {
      $scope.quizs[i].useranser = "";
    }
    $scope.timerCount = 900;
    $scope.numberQuiz = 0; // trở về câu đầu tiên 
    //Các câu đáp án đã chọn bị reset
    var checked = document.querySelectorAll(".form-check-input");
    checked.forEach(element => {

      element.checked = false;
    });
    $interval.cancel(stop);
    $scope.init();
  }
  // Đếm ngược thời gian
  $scope.init = function () {
    stop = $interval(function () {
      $scope.timerCount--;
      $scope.minutesTimerCount = Math.floor($scope.timerCount / 60);
      $scope.secondsTimerCount = $scope.timerCount - ($scope.minutesTimerCount * 60);

    }, 1000)
    if ($scope.timerCount <= 1) {
      $scope.getAmount();
    }
  }
  // Đổ dữ liệu từ file vào biến
  $http.get("../assets/db/Quizs/ADAV.js").then(function (response) {
    $scope.quizs = response.data;

    $scope.next = function () {
      if ($scope.numberQuiz < (9)) {
        $scope.numberQuiz += 1;
        $scope.disabledprev = false;
      } else {
        $scope.numberQuiz = 9;
        $scope.disablednext = true;
      }
    }
    // Tính điểm 
    $scope.getAmount = function () {
      $rootScope.mark = 0;
      var checked = document.querySelectorAll(".form-check-input");
      for (var i = 0; i < 9; i++) {
        document.getElementById($scope.quizs[i].AnswerId).classList.add("text-success");
        document.getElementById($scope.quizs[i].AnswerId).classList.add("fas");
        document.getElementById($scope.quizs[i].AnswerId).classList.add("fa-check-circle");
        if ($scope.quizs[i].useranser) {
          if ($scope.quizs[i].useranser == $scope.quizs[i].AnswerId) {
            $rootScope.mark += 1;
            document.getElementById($scope.quizs[i].AnswerId).classList.add("text-success");
            document.getElementById($scope.quizs[i].AnswerId).classList.add("fas");
            document.getElementById($scope.quizs[i].AnswerId).classList.add("fa-check-circle");
          } else {
            document.getElementById($scope.quizs[i].AnswerId).classList.add("text-success");
            document.getElementById($scope.quizs[i].AnswerId).classList.add("fas");
            document.getElementById($scope.quizs[i].AnswerId).classList.add("fa-check-circle");
            if ($scope.quizs[i].useranser != null) {
              document.getElementById($scope.quizs[i].AnswerId).classList.add("text-success");
              document.getElementById($scope.quizs[i].AnswerId).classList.add("fas");
              document.getElementById($scope.quizs[i].AnswerId).classList.add("fa-check-circle");

              document.getElementById($scope.quizs[i].useranser).classList.add("text-danger");
              document.getElementById($scope.quizs[i].useranser).classList.add("fas");
              document.getElementById($scope.quizs[i].useranser).classList.add("fa-times-circle");
            } else {
              document.getElementById($scope.quizs[i].AnswerId).classList.add("text-success");
              document.getElementById($scope.quizs[i].AnswerId).classList.add("fas");
              document.getElementById($scope.quizs[i].AnswerId).classList.add("fa-check-circle");
            }
          }
        }
      }
      $scope.disabledInput = true;
      $interval.cancel(stop);
      if ($rootScope.mark >= 5) {
        Swal.fire(
          'Chúc mừng!',
          'Bạn đã đạt hoàn thành được Quiz! Điểm số :' + $rootScope.mark + '/10',
          'success'
        )
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Bạn bị fail',
          text: 'Bạn chỉ đạt được điểm số :' + $rootScope.mark + '/10',

        })
      }
    };
    $scope.prev = function () {
      if ($scope.numberQuiz > 1) {
        $scope.numberQuiz -= 1;
        $scope.disablednext = false;
      } else {
        $scope.numberQuiz = 0;
        $scope.disabledprev = true;
      }
    }
    // Thực hiện show quiz ại vị trí numPage
    $scope.showQuiz = function (numPage) {
      if ($scope.numberQuiz == numPage || $scope.viewMode == true) {
        return true;
      } else {
        return false;
      }

    }
  }, function (response) {
    alert("Erroor");
  });

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
  // đổ dữ liệu môn học vào file json;
  $http.get("../assets/db/Subjects.JSON").then(function (response) {
    $scope.Subjects = response.data.x;

  }, function (response) {
    alert("Erroor");
  });
});