var myModule = angular.module('myModule', ['ui.router'])
    //大小写不区分
    .config(function($urlMatcherFactoryProvider) {
        $urlMatcherFactoryProvider.caseInsensitive(true);
    })
    //默认页面
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise("home");
    })

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})

.config(function($stateProvider) {

        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "Templates/27.4/home.html",
                controller: "homeController",
                controllerAs: "homeCtrl",
                data: {
                    customData1: "首页自定义数据1",
                    customData2: "首页自定义数据2"
                }
            })
            .state("courses", {
                url: "/courses",
                templateUrl: "Templates/27.4/courses.html",
                controller: "coursesController",
                controllerAs: "coursesCtrl",
                data: {
                    customData1: "课程自定义数据1",
                    customData2: "课程自定义数据2"
                }
            })

        .state("employeesParent", {
            url: "/employees",
            templateUrl: "Templates/27.4/employeesParent.html",
            controller: "employeesParentController",
            controllerAs: "employeesParentCtrl",
            resolve: {
                employeesTotals: function($http) {

                	console.log('total')
                    return $http.get("http://10.2.164.44:8888/angular/getemployeetotal.cfm")
                        .then(function(response) {

                            return response.data;
                        })
                }
            }
        })

        .state("employeesParent.employees", {
            url: "/",
            templateUrl: "Templates/27.4/employees.html",
            controller: "employeesController",
            controllerAs: "employeesCtrl",
            resolve: {
                employeeslist: function($http) {
                	console.log('list')
                    return $http.get("http://10.2.164.44:8888/angular/employee.cfm")
                        .then(function(response) {
                            return response.data.rows;
                        })
                }
            }
        })

        .state("employeesParent.employeeDetail", {
            url: "/:id",
            templateUrl: "Templates/27.4/employeedetail.html",
            controller: "employeeDetailController",
            controllerAs: "employeeDetailCtrl"
        })

        .state("employeesSearch", {
            url: "/employeesSearch/:firstname",
            templateUrl: "Templates/27.4/employeesSearch.html",
            controller: "employeesSearchController",
            controllerAs: "employeesSearchCtrl"
        })

    })
    .controller("employeesParentController", function(employeesTotals) {
        this.males = employeesTotals.males;
        this.females = employeesTotals.females;
        this.total = employeesTotals.total;
    })
    .controller('homeController', function($state) {
        this.message = "Home page";

        this.homeCustomData1 = $state.current.data.customData1;
        this.homeCustomData2 = $state.current.data.customData2;

        this.coursesCustomData1 = $state.get("courses").data.customData1;
        this.coursesCustomData2 = $state.get("courses").data.customData2;

    })
    .controller('coursesController', function() {
        this.courses = ["Android", "Ios", "Html5", "Java"];
    })
    .controller('employeesController', function(employeeslist, $state, $location, employeesTotals) {
        var vm = this;

        vm.employeesSearch = function() {
            $state.go("employeesSearch", {
                firstname: vm.firstname
            });
        }

        vm.reloadData = function() {
            $state.reload();
        }

        vm.employees = employeeslist;
        vm.employeesTotals = employeesTotals;
    })
    .controller("employeesSearchController", function($http, $stateParams) {
        var vm = this;

        if ($stateParams.firstname) {
            $http({
                url: "http://localhost:8888/angular/employeesearch.cfm",
                method: "get",
                params: {
                    firstname: $stateParams.firstname
                }
            }).then(function(response) {
                vm.employees = response.data.rows;
            })
        } else {
            $http.get("http://localhost:8888/angular/employee.cfm")
                .then(function(response) {
                    vm.employees = response.data.rows;
                })
        }
    })
    .controller('employeeDetailController', function($http, $stateParams) {
        var vm = this;
        $http({
            url: "http://localhost:8888/angular/employeedetail.cfm",
            params: {
                id: $stateParams.id
            },
            method: "get"
        }).then(function(response) {
            vm.employee = response.data[0];
        })
    });
