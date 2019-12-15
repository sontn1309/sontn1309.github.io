var app = angular.module("sontn1309", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider.when("/home", {
            templateUrl: "pages/home.html"
        }).when("/subjects", {
            templateUrl: "pages/subjects.html",
            controller: "subjects-ctrl",
        })
        .when("/quiz", {
            templateUrl: "pages/quiz.html",
            controller: "quiz-ctrl",
        })
        .when("/login", {
            templateUrl: "pages/login-page.html",
            controller: "login-page-ctrl",
        })
        .when("/forgot-pass", {
            templateUrl: "pages/forgot-pass.html",
            controller: "forgot-pass-ctrl",
        })
        .when("/contact", {
            templateUrl: "pages/contact.html",
            controller: "contact-ctrl",
        })
        .when("/info-user", {
            templateUrl: "pages/info-user.html",
            controller: "info-user-ctrl",
        })
        .when("/signup-page", {
            templateUrl: "pages/signup-page.html",
            controller: "signup-page-ctrl",
        }).otherwise({
            redirectTo: "/home"
        });
});
app.run(function ($rootScope) {
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
    $rootScope.$on('$routeChangeError', function () {
        $rootScope.loading = false;
        alert("Lỗi");
    });
});
app.controller("menu-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    $scope.showQuiz;
    $scope.Logout = function () {
        sessionStorage.clear();
    }
    $scope.Login = function () {
        var x = sessionStorage.getItem('user');
        if (x != null) {
            document.getElementById("username").innerHTML = x;
            return true;
        } else {
            return false;
        }
    }
    $http.get("assets/db/Subjects.JSON").then(function (response) {
        $scope.Subjects = response.data.x;
        $scope.showQuiz = function (subjectId, subjectName) {
            sessionStorage.setItem('subjectId', subjectId);
            sessionStorage.setItem('subjectName', subjectName);

        }
    }, function (response) {
        alert("Erroor");
    });
});
app.controller("subjects-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    $http.get("../assets/db/Subjects.JSON").then(function (response) {
        $scope.Subjects = response.data.x;
        $scope.showQuiz = function (subjectId, subjectName) {
            sessionStorage.setItem('subjectId', subjectId);
            sessionStorage.setItem('subjectName', subjectName);
        }
    }, function (response) {
        alert("Erroor");
    });

});
app.controller("quiz-ctrl", function ($scope, $http, $interval, $rootScope) {
    var stop
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
    $scope.classList = false;
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

        for (var i = 0; i <= 9 && ($scope.classList); i++) {

            document.getElementById($scope.quizs[i].AnswerId).classList.remove("text-success");
            document.getElementById($scope.quizs[i].AnswerId).classList.remove("fas");
            document.getElementById($scope.quizs[i].AnswerId).classList.remove("fa-check-circle");
            if ($scope.quizs[i].useranser === undefined || $scope.quizs[i].useranser === null || $scope.quizs[i].useranser === "") {


            } else {

                document.getElementById($scope.quizs[i].useranser).classList.remove("text-danger");
                document.getElementById($scope.quizs[i].useranser).classList.remove("fas");
                document.getElementById($scope.quizs[i].useranser).classList.remove("fa-times-circle");
                $scope.quizs[i].useranser = "";
            }

        }

        for (var i = 0; i <= 9; i++) {
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
        $scope.classList = false;
        console.log($scope.classList)
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
    var subjectId = sessionStorage.getItem('subjectId');
    var subjectName = sessionStorage.getItem('subjectName');
    $scope.subjectName = subjectName;
    $http.get("../assets/db/Quizs/" + subjectId + ".js").then(function (response) {
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
            $scope.classList = true;
            console.log($scope.classList)
            for (var i = 0; i <= 9; i++) {
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
app.controller("forgot-pass-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    $scope.account = [];
    $scope.checkLogin = false;
    $scope.showMsg = false;
    $http.get("../assets/db/Students.JSON").then(function (response) {
        $scope.account = response.data.x;

        $scope.xmn = function () {          
          
          
            angular.forEach($scope.account, function (item) {
                if ($scope.username == item.username && $scope.email == item.email) {
                    Swal.fire(
                        'Mật khẩu :' + item.password
                    ).then(function () {
                        window.location.assign("../index.html#/login");
                    });
                }
            });
            $scope.showMsg = !$scope.checkLogin;
        }
    }, function (response) {
        alert("Lỗi kết nối tới máy chủ");
    });
});
app.controller("login-page-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    $scope.account = [];
    $scope.checkLogin = false;
    $scope.showMsg = false;
    $http.get("../assets/db/Students.JSON").then(function (response) {
        $scope.account = response.data.x;

        $scope.xmn = function () {
          
            angular.forEach($scope.account, function (item) {
                if ($scope.username == item.username && $scope.password == item.password) {
                    sessionStorage.setItem('user', $scope.username);
                    $scope.checkLogin = true;
                    Swal.fire({

                        icon: 'success',
                        title: 'Đăng nhập thành công',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function () {
                        window.location.assign("../index.html#/home");
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
app.controller("contact-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
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
    $http.get("../assets/db/Subjects.JSON").then(function (response) {
        $scope.Subjects = response.data.x;
    }, function (response) {
        alert("Erroor");
    });
});
app.controller("info-user-ctrl", function ($scope, $http) {
    $scope.Subjects = [];
    var x = sessionStorage.getItem('user');
    $scope.Logout = function () {
        sessionStorage.clear();
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